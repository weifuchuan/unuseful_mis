package com.fuchuan.unuseful_mis.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseStudent<M extends BaseStudent<M>> extends Model<M> implements IBean {

	public void setId(java.lang.Long id) {
		set("id", id);
	}
	
	public java.lang.Long getId() {
		return getLong("id");
	}

	public void setName(java.lang.String name) {
		set("name", name);
	}
	
	public java.lang.String getName() {
		return getStr("name");
	}

	public void setSex(java.lang.String sex) {
		set("sex", sex);
	}
	
	public java.lang.String getSex() {
		return getStr("sex");
	}

	public void setBirthday(java.util.Date birthday) {
		set("birthday", birthday);
	}
	
	public java.util.Date getBirthday() {
		return get("birthday");
	}

	public void setNation(java.lang.String nation) {
		set("nation", nation);
	}
	
	public java.lang.String getNation() {
		return getStr("nation");
	}

	public void setNative(java.lang.String _native) {
		set("native", _native);
	}
	
	public java.lang.String getNative() {
		return getStr("native");
	}

	public void setClazzId(java.lang.Long clazzId) {
		set("clazzId", clazzId);
	}
	
	public java.lang.Long getClazzId() {
		return getLong("clazzId");
	}

}
