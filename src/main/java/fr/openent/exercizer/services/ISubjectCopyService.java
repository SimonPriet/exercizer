package fr.openent.exercizer.services;

import org.entcore.common.user.UserInfos;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import fr.wseduc.webutils.Either;

public interface ISubjectCopyService {
	
	/**
     *@see fr.openent.exercizer.services.impl.AbstractExercizerServiceSqlImpl
     */
    void persist(final JsonObject resource, final UserInfos user, final Handler<Either<String, JsonObject>> handler);

    /**
     *@see fr.openent.exercizer.services.impl.AbstractExercizerServiceSqlImpl
     */
    void update(final JsonObject resource, final UserInfos user, final Handler<Either<String, JsonObject>> handler);
    
    /**
     * @see fr.openent.exercizer.services.impl.AbstractExercizerServiceSqlImpl
     */
    void list(final UserInfos user, final Handler<Either<String, JsonArray>> handler);
    
    /**
     *@see fr.openent.exercizer.services.impl.AbstractExercizerServiceSqlImpl
     */
    void listBySubjectScheduled(final JsonObject resource, final Handler<Either<String, JsonArray>> handler);
    
    /**
     *@see fr.openent.exercizer.services.impl.AbstractExercizerServiceSqlImpl
     */
    void listBySubjectScheduledList(final UserInfos user, final Handler<Either<String, JsonArray>> handler);

    /**
     *@see fr.openent.exercizer.services.impl.AbstractExercizerServiceSqlImpl
     */    
    void getById(final String id, final UserInfos user, final Handler<Either<String, JsonObject>> handler);
}
