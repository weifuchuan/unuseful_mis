import { Student, Clazz, Course, Score } from "./types";
import { observable } from "mobx";
import $ from "axios";

export class Store {
	@observable students: Student[];
	@observable clazzes: Clazz[];
	@observable courses: Course[];
	@observable scores: Score[];

	constructor() {
		this.initFromServer();
	}

	private async initFromServer() {
		try {
			const resp = await fetch("/init", {
				method: "post"
			});
			const {
				students,
				scores,
				clazzes,
				courses
			}: {
				students: Student[];
				clazzes: Clazz[];
				courses: Course[];
				scores: Score[];
			} = await resp.json();
			this.students = observable(students);
			this.clazzes = observable(clazzes);
			this.courses = observable(courses);
			this.scores = observable(scores);
		} catch (e) {
			console.error(e);
			// window.alert(e.toString());
			const {
				students,
				scores,
				clazzes,
				courses
			}: {
				students: Student[];
				clazzes: Clazz[];
				courses: Course[];
				scores: Score[];
			} = {
				courses: [{ courseHour: 20, creditHour: 4, id: 1, name: "Java" }],
				clazzes: [
					{ grade: "2015", id: 1, institute: "管理", name: "信管1班", num: 30 }
				],
				scores: [
					{ courseId: 1, id: 1, score: 100, studentId: 1, term: "2018-2" }
				],
				students: [
					{
						birthday: "2018-06-15",
						clazzId: 1,
						id: 1,
						name: "fuchuan",
						nation: "中国",
						native: "北京",
						sex: "男"
					}
				]
			};
			this.students = observable(students);
			this.clazzes = observable(clazzes);
			this.courses = observable(courses);
			this.scores = observable(scores);
			return;
		}
	}

	async addStudent(student: any): Promise<void> {
		const resp = await fetch("/student/add", {
			method: "post",
			body: JSON.stringify(student)
		});
		const data: {
			ok: boolean;
			student?: Student;
			error?: string;
		} = await resp.json();
		if (data.ok) {
			this.students.push(observable(data.student));
			return;
		} else {
			throw data.error;
		}
	}

	async addClazz(clazz: any): Promise<void> {
		const resp = await fetch("/clazz/add", {
			method: "post",
			body: JSON.stringify(clazz)
		});
		const data: {
			ok: boolean;
			clazz?: Clazz;
			error?: string;
		} = await resp.json();
		if (data.ok) {
			this.clazzes.push(observable(data.clazz));
			return;
		} else {
			throw data.error;
		}
	}

	async addCourse(course: any): Promise<void> {
		const resp = await fetch("/course/add", {
			method: "post",
			body: JSON.stringify(course)
		});
		const data: {
			ok: boolean;
			course?: Course;
			error?: string;
		} = await resp.json();
		if (data.ok) {
			this.courses.push(observable(data.course));
			return;
		} else {
			throw data.error;
		}
	}

	async addScore(score: any): Promise<void> {
		const resp = await fetch("/score/add", {
			method: "post",
			body: JSON.stringify(score)
		});
		const data: {
			ok: boolean;
			score?: Score;
			error?: string;
		} = await resp.json();
		if (data.ok) {
			this.scores.push(observable(data.score));
			return;
		} else {
			throw data.error;
		}
	}

	async updateStudents(students: Student[]): Promise<void> {
		const resp = await fetch("/student/update", {
			method: "post",
			body: JSON.stringify(students)
		});
		const { ok, error } = await resp.json();
		if (ok) {
			(this.students as any).clear();
			this.students.push(...observable(students));
			return;
		} else {
			throw error;
		}
	}

	async updateClazzes(clazzes: Clazz[]): Promise<void> {
		const resp = await fetch("/clazz/update", {
			method: "post",
			body: JSON.stringify(clazzes)
		});
		const { ok, error } = await resp.json();
		if (ok) {
			(this.clazzes as any).clear();
			this.clazzes.push(...observable(clazzes));
			return;
		} else {
			throw error;
		}
	}

	async updateCourses(courses: Course[]): Promise<void> {
		const resp = await fetch("/course/update", {
			method: "post",
			body: JSON.stringify(courses)
		});
		const { ok, error } = await resp.json();
		if (ok) {
			(this.courses as any).clear();
			this.courses.push(...observable(courses));
			return;
		} else {
			throw error;
		}
	}

	async updateScores(scores: Score[]): Promise<void> {
		const resp = await fetch("/score/update", {
			method: "post",
			body: JSON.stringify(scores)
		});
		const { ok, error } = await resp.json();
		if (ok) {
			(this.scores as any).clear();
			this.scores.push(...observable(scores));
			return;
		} else {
			throw error;
		}
	}

	async deleteStudent(student: Student): Promise<void> {
		const resp = await fetch(`/student/delete/${student.id}`, {
			method: "post"
		});
		const { ok, error } = await resp.json();
		if (ok) {
			const i = this.students.findIndex(stu => stu.id === student.id);
			if (i !== -1) {
				this.students.splice(i, 1);
			}
			return;
		} else {
			throw error;
		}
	}

	async deleteClazz(clazz: Clazz): Promise<void> {
		const resp = await fetch(`/clazz/delete/${clazz.id}`, {
			method: "post"
		});
		const { ok, error } = await resp.json();
		if (ok) {
			const i = this.clazzes.findIndex(c => c.id === clazz.id);
			if (i !== -1) {
				this.clazzes.splice(i, 1);
			}
			return;
		} else {
			throw error;
		}
	}

	async deleteCourse(course: Course): Promise<void> {
		const resp = await fetch(`/course/delete/${course.id}`, {
			method: "post"
		});
		const { ok, error } = await resp.json();
		if (ok) {
			const i = this.courses.findIndex(c => c.id === course.id);
			if (i !== -1) {
				this.courses.splice(i, 1);
			}
			return;
		} else {
			throw error;
		}
	}

	async deleteScore(score: Score): Promise<void> {
		const resp = await fetch(`/score/delete/${score.id}`, {
			method: "post"
		});
		const { ok, error } = await resp.json();
		if (ok) {
			const i = this.scores.findIndex(c => c.id === score.id);
			if (i !== -1) {
				this.scores.splice(i, 1);
			}
			return;
		} else {
			throw error;
		}
	}

	async search(sql: string): Promise<{ columns: string[]; data: any[] }> {
		const resp = await fetch("/search", {
			method: "post",
			body: JSON.stringify({ sql })
		});
		const {
			ok,
			error,
			columns,
			data
		}: {
			ok: boolean;
			error?: string;
			columns?: string[];
			data?: any[][];
		} = await resp.json();
		if (ok) {
			const objs = new Array<any>();
			for (let row of data) {
				const obj:any = {};
				let i = 0; 
				for (let column of columns) {
					obj[column] = row[i++];
				}
				objs.push(obj);
			}
			return { columns, data: objs };
		} else throw error;
	}
}

export default new Store();
export { Student, Score, Clazz, Course } from "./types";
