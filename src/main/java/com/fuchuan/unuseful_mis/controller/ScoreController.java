package com.fuchuan.unuseful_mis.controller;

import com.alibaba.fastjson.JSON;
import com.fuchuan.unuseful_mis.model.Score;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/score")
public class ScoreController implements IModelController {
    @PostMapping("/add")
    @ResponseBody
    public String add(@RequestBody String req) {
        Score score = JSON.parseObject(req, Score.class);
        Map<String, Object> resp = new HashMap<>();
        try {
            if (score.save()) {
                resp.put("ok", true);
                resp.put("score", score);
            } else {
                resp.put("ok", false);
                resp.put("error", "Add failed");
            }
        } catch (Exception e) {
            resp.put("ok", false);
            resp.put("error", e.toString());
        }
        return JSON.toJSONStringWithDateFormat(resp, "yyyy-MM-dd");
    }

    @PostMapping("/update")
    @ResponseBody
    public String update(@RequestBody String req) {
        Score[] scores = JSON.parseObject(req, Score[].class);
        List<String> failedInfos = new ArrayList<>();
        for (Score score : scores) {
            try {
                if (!score.update())
                    failedInfos.add("id " + score.getId() + "failed; ");
            } catch (Exception e) {
                failedInfos.add("id " + score.getId() + "failed by " + e.toString());
            }
        }
        Map<String, Object> resp = new HashMap<>();
        if (failedInfos.size() == 0) {
            resp.put("ok", true);
        } else {
            resp.put("ok", false);
            resp.put("error", failedInfos.stream().reduce((s1, s2) -> s1 + s2).get());
        }
        return JSON.toJSONString(resp);
    }

    @PostMapping("/delete/{id}")
    @ResponseBody
    public String delete(@PathVariable int id) {
        Map<String, Object> resp = new HashMap<>();
        try {
            if (Score.dao.deleteById(id)) {
                resp.put("ok", true);
            } else {
                resp.put("ok", false);
                resp.put("error", "delete " + id + " failed");
            }
        } catch (Exception e) {
            resp.put("ok", false);
            resp.put("error", e.toString());
        }
        return JSON.toJSONString(resp);
    }

}
