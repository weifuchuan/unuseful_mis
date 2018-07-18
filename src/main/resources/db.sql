/*
SQLyog Community v13.0.1 (64 bit)
MySQL - 5.7.19 : Database - unuseful_mis
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`unuseful_mis` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `unuseful_mis`;

/*Table structure for table `clazz` */

DROP TABLE IF EXISTS `clazz`;

CREATE TABLE `clazz` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `institute` varchar(64) NOT NULL,
  `grade` varchar(32) NOT NULL,
  `num` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `course` */

DROP TABLE IF EXISTS `course`;

CREATE TABLE `course` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `creditHour` double NOT NULL,
  `courseHour` double NOT NULL,
  `priorCourse` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `priorCourse` (`priorCourse`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`priorCourse`) REFERENCES `course` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `score` */

DROP TABLE IF EXISTS `score`;

CREATE TABLE `score` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` int(10) unsigned NOT NULL,
  `studentId` int(10) unsigned NOT NULL,
  `term` varchar(100) COLLATE utf8_bin NOT NULL,
  `score` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `score_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`),
  CONSTRAINT `score_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `student` */

DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_bin NOT NULL,
  `sex` varchar(2) COLLATE utf8_bin NOT NULL DEFAULT '男',
  `birthday` date NOT NULL,
  `nation` varchar(32) COLLATE utf8_bin NOT NULL,
  `native` varchar(32) COLLATE utf8_bin NOT NULL,
  `clazzId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clazz_id` (`clazzId`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`clazzId`) REFERENCES `clazz` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
