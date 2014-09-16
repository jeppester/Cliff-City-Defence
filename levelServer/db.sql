-- phpMyAdmin SQL Dump
-- version 4.0.0
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 07. 01 2014 kl. 07:57:43
-- Serverversion: 5.5.33a-MariaDB
-- PHP-version: 5.5.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `CCD`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `level`
--

CREATE TABLE IF NOT EXISTS `level` (
  `lid` int(3) NOT NULL AUTO_INCREMENT,
  `levelcollection` int(3) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `createtime` timestamp NULL DEFAULT NULL,
  `savedtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `order` int(2) DEFAULT NULL,
  `theme` varchar(40) DEFAULT 'Day',
  `hardness` float(3,2) DEFAULT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=53 ;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `levelcollection`
--

CREATE TABLE IF NOT EXISTS `levelcollection` (
  `lcid` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `user` int(4) DEFAULT NULL,
  PRIMARY KEY (`lcid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `levelstats`
--

CREATE TABLE IF NOT EXISTS `levelstats` (
  `lsid` int(5) NOT NULL AUTO_INCREMENT,
  `level` int(3) DEFAULT NULL,
  `impactfactor` float(3,2) DEFAULT NULL,
  `meanfalldistance` float(4,1) DEFAULT NULL,
  PRIMARY KEY (`lsid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1327 ;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `rock`
--

CREATE TABLE IF NOT EXISTS `rock` (
  `level` int(3) NOT NULL DEFAULT '0',
  `order` int(3) NOT NULL DEFAULT '0',
  `type` varchar(20) DEFAULT NULL,
  `rocklevel` int(1) DEFAULT NULL,
  `spawndelay` int(3) DEFAULT NULL,
  `x` int(3) DEFAULT NULL,
  `dir` float(4,3) DEFAULT NULL,
  PRIMARY KEY (`level`,`order`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
