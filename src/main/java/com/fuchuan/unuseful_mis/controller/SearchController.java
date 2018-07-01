package com.fuchuan.unuseful_mis.controller;

import com.alibaba.fastjson.JSON;
import javafx.beans.property.SimpleObjectProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class SearchController {
    @Autowired
    private JdbcTemplate jdbc;

    @PostMapping("/search")
    @ResponseBody
    public String search(@RequestBody String req) {
        try {
            SearchReq searchReq = JSON.parseObject(req, SearchReq.class);
            SimpleObjectProperty<String[]> columns = new SimpleObjectProperty<>(null);
            List<Object[]> list = jdbc.query(searchReq.getSql(), (ResultSet rs, int rowNum) -> {
                ResultSetMetaData metaData = rs.getMetaData();
                int cc = metaData.getColumnCount();
                if (columns.isNull().get()) {
                    String[] cs = new String[cc];
                    for (int i = 1; i <= cc; i++)
                        cs[i - 1] = metaData.getColumnName(i);
                    columns.set(cs);
                }
                Object[] cs = new Object[cc];
                for (int i = 1; i <= cc; i++)
                    cs[i - 1] = rs.getObject(i);
                return cs;
            });
            Map<String, Object> resp = new HashMap<>();
            resp.put("ok", true);
            resp.put("columns", columns.getValue());
            resp.put("data", list);
            return JSON.toJSONString(resp);
        } catch (Exception ex) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("ok", false);
            resp.put("error", ex.toString());
            return JSON.toJSONString(resp);
        }
    }
}

