/*
 * Copyright © Conseil Régional Nord Pas de Calais - Picardie, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package fr.openent.exercizer.cron;

import fr.wseduc.webutils.Either;
import fr.wseduc.webutils.I18n;
import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.sql.Sql;
import org.entcore.common.sql.SqlResult;
import org.entcore.common.user.UserInfos;
import org.entcore.common.utils.DateUtils;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.logging.impl.LoggerFactory;

import java.text.ParseException;
import java.util.Date;
import java.util.List;


public class ScheduledNotification implements Handler<Long> {

    private final Sql sql = Sql.getInstance();
    private final TimelineHelper timelineHelper;
    private final String host;
    private static final I18n i18n = I18n.getInstance();
    private static final Logger log = LoggerFactory.getLogger(ScheduledNotification.class);

    public ScheduledNotification(final TimelineHelper timelineHelper, final String host) {
        this.timelineHelper = timelineHelper;
        this.host = host;
    }

    @Override
    public void handle(Long event) {
        // find subject scheduled doesn't notified
        final String query = "SELECT ss.id, ss.owner, ss.owner_username, ss.title, ss.begin_date, ss.due_date, array_to_json(array_agg(sc.owner)) AS owners " +
                " FROM exercizer.subject_scheduled AS ss INNER JOIN exercizer.subject_copy as sc ON ss.id=sc.subject_scheduled_id" +
                " WHERE ss.is_notify = false GROUP BY ss.id";

        sql.prepared(query, new JsonArray(), SqlResult.validResultHandler(new Handler<Either<String, JsonArray>>() {
            @Override
            public void handle(Either<String, JsonArray> event) {
                if (event.isRight()) {
                    final JsonArray result = event.right().getValue();

                    if (result != null && result.size() > 0) {
                        final Date nowUTC = new DateTime(DateTimeZone.UTC).toLocalDateTime().toDate();
                        for (Object r : result) {
                            if (!(r instanceof JsonObject)) continue;
                            final JsonObject scheduledSubject = (JsonObject) r;

                            // check begin_date for ,otify
                            Date beginDate = null;
                            Date dueDate = null;
                            try {
                                beginDate = DateUtils.parseTimestampWithoutTimezone(scheduledSubject.getString("begin_date"));
                                dueDate = DateUtils.parseTimestampWithoutTimezone(scheduledSubject.getString("due_date"));
                            } catch (ParseException e) {
                                log.error("[CRON Exerciser] Can't parse begin date or due date of scheduled subject", e);

                            }

                            if (beginDate != null && dueDate != null) {
                                final Boolean isNotify = DateUtils.lessOrEqualsWithoutTime(beginDate, nowUTC);

                                if (isNotify) {
                                    final String dueDateFormat = DateUtils.format(dueDate);

                                    final String query =
                                            "UPDATE exercizer.subject_scheduled " +
                                                    " SET is_notify=TRUE, modified = NOW() " +
                                                    "WHERE id = ? ";

                                    final JsonArray values = new JsonArray();
                                    values.addNumber(scheduledSubject.getLong("id"));

                                    sql.prepared(query, values, SqlResult.validRowsResultHandler(new Handler<Either<String, JsonObject>>() {
                                        @Override
                                        public void handle(Either<String, JsonObject> event) {
                                            if (event.isRight()) {

                                                final String subjectName = scheduledSubject.getString("title");

                                                final List<String> recipientSet = scheduledSubject.getArray("owners").toList();

                                                final UserInfos user = new UserInfos();
                                                user.setUserId(scheduledSubject.getString("owner"));
                                                user.setUsername(scheduledSubject.getString("owner_username"));

                                                JsonObject params = new JsonObject();
                                                params.putString("uri", host + "/exercizer#/dashboard/student");
                                                params.putString("userUri", host + "/userbook/annuaire#" + user.getUserId());
                                                params.putString("username", user.getUsername());
                                                params.putString("subjectName", subjectName);
                                                params.putString("dueDate", dueDateFormat);
                                                params.putString("resourceUri", params.getString("uri"));
                                                timelineHelper.notifyTimeline(null, "exercizer.assigncopy", user, recipientSet, null, params);
                                            } else {
                                                log.error("[CRON Exerciser] Can't update scheduled subject : " + event.left().getValue());
                                            }
                                        }
                                    }));
                                }
                            }
                        }
                    }
                } else {
                    log.error(event.left().getValue());
                }
            }
        }, "owners"));
    }
}