package com.fuchuan.unuseful_mis.model;

import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.dialect.MysqlDialect;
import com.jfinal.plugin.activerecord.generator.Generator;
import com.mysql.jdbc.Driver;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

import javax.sql.DataSource;
import java.sql.SQLException;

public class _Generator{

  private static DataSource getDataSource() throws SQLException{
    String url = "jdbc:mysql://localhost:3306/unuseful_mis?characterEncoding=utf-8";
    String username = "root";
    String password = "fc";
    SimpleDriverDataSource ds = new SimpleDriverDataSource(new Driver(), url, username, password);
    return ds;
  }
  
  public static void main(String[] args) throws SQLException {
    // base model 所使用的包名
    String baseModelPackageName = "com.fuchuan.unuseful_mis.model.base";
    // base model 文件保存路径
    String baseModelOutputDir = PathKit.getWebRootPath() + "/src/main/java/com/fuchuan/unuseful_mis/model/base";

    System.out.println("输出路径：" + baseModelOutputDir);

    // model 所使用的包名 (MappingKit 默认使用的包名)
    String modelPackageName = "com.fuchuan.unuseful_mis.model";
    // model 文件保存路径 (MappingKit 与 DataDictionary 文件默认保存路径)
    String modelOutputDir = baseModelOutputDir + "/..";

    // 创建生成器
    Generator gen = new Generator(getDataSource(), baseModelPackageName, baseModelOutputDir, modelPackageName,
        modelOutputDir);
    // 设置数据库方言
    gen.setDialect(new MysqlDialect());
    // 添加不需要生成的表名
    // for (String table : excludedTable) {
    //   gen.addExcludedTable(table);
    // }
    // 设置是否在 Model 中生成 dao 对象
    gen.setGenerateDaoInModel(true);
    // 设置是否生成字典文件
    gen.setGenerateDataDictionary(true);
    // 设置需要被移除的表名前缀用于生成modelName。例如表名 "osc_user"，移除前缀 "osc_"后生成的model名为 "User"而非
    // OscUser
    // gernerator.setRemovedTableNamePrefixes("t_");
    // 生成
    gen.generate();
  }
}