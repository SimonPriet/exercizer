package fr.openent.exercizer.exporter;

import org.entcore.common.bus.WorkspaceHelper;
import org.entcore.common.storage.Storage;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.impl.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ImagesToBase64 {

    private Pattern pattern = Pattern.compile("&lt;img src=\"/workspace/document/.{36}");
    private WorkspaceHelper workspaceHelper;
    private Matcher m;

    public ImagesToBase64(String text, EventBus eb, Storage storage) {
        this.workspaceHelper = new WorkspaceHelper(eb, storage);
        System.out.println(text);
        this.m = this.pattern.matcher(text);
    }

    public void exportImagesToBase64(final String text, final Handler<String> handler){
        if(m.find()){
            final String sub = m.group();
            this.workspaceHelper.readDocument(sub.substring(33, 69), new Handler<WorkspaceHelper.Document>() {
                @Override
                public void handle(WorkspaceHelper.Document doc) {
                    if(doc != null) {
                        exportImagesToBase64(text.replace(sub, "&lt;img src=\"data:image/png;base64," +
                                Base64.encodeBytes(doc.getData().getBytes())), handler);
                    }else{
                        exportImagesToBase64(text.replace(sub, "&lt;img src=\""), handler);
                    }
                }
            });
        }else{
            handler.handle(text);
        }
    }
}