package com.fuchuan.unuseful_mis.config;

import com.fuchuan.unuseful_mis.model.*;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.template.ext.spring.JFinalViewResolver;
import com.jfinal.template.source.ClassPathSourceFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class JFinalConfig {
    @Bean
    public JFinalViewResolver jFinalViewResolver() {
        JFinalViewResolver jvr = new JFinalViewResolver();
        jvr.setDevMode(true);
        jvr.setSourceFactory(new ClassPathSourceFactory());
        jvr.setPrefix("/templates/");
        jvr.setSuffix(".html");
        jvr.setContentType("text/html;charset=UTF-8");
        jvr.setOrder(0);
        return jvr;
    }

    @Bean
    public ActiveRecordPlugin activeRecordPlugin(DataSource dataSource) {
        ActiveRecordPlugin ar = new ActiveRecordPlugin(dataSource);
        ar.setShowSql(true);
        _MappingKit.mapping(ar);
        ar.start();
        return ar;
    }
}
