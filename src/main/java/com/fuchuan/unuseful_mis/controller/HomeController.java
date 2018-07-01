package com.fuchuan.unuseful_mis.controller;

import com.alibaba.fastjson.JSON;
import com.fuchuan.unuseful_mis.model.Clazz;
import com.fuchuan.unuseful_mis.model.Course;
import com.fuchuan.unuseful_mis.model.Score;
import com.fuchuan.unuseful_mis.model.Student;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/init")
    @ResponseBody
    public String init() {
        List<Student> students = Student.dao.find("select * from `student`");
        List<Clazz> clazzes = Clazz.dao.find("select * from `clazz`");
        List<Score> scores = Score.dao.find("select * from `score`");
        List<Course> courses = Course.dao.find("select * from `course`");
        Map<String, Object> resp = new HashMap<>();
        resp.put("students", students);
        resp.put("clazzes", clazzes);
        resp.put("scores", scores);
        resp.put("courses", courses);
        return JSON.toJSONStringWithDateFormat(resp, "yyyy-MM-dd");
    }
}
