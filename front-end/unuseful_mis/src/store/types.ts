export class Student {
	id: number = 0;
	name: string = "";
	sex: string = "";
	birthday: string = "";
	nation: string = "";
	native: string = "";
	clazzId: number = 0;
}

export class Clazz {
	id: number = 0;
	name: string = "";
	institute: string = "";
	grade: string = "";
	num: number = 0;
}

export class Course {
	id: number = 0;
	name: string = "";
	creditHour: number = 0;
	courseHour: number = 0;
	priorCourse?: number = 0;
}

export class Score {
	id: number = 0;
	courseId: number = 0;
	studentId: number = 0;
	term: string = "";
	score: number = 0;
}
