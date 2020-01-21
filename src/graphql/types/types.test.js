import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';

import { Term, TermStatistics } from './term';
import Backup from './backup';
import Tag from './tag';
import Segment from './segment';

const checkCustomType = (Type, field, type) => () => {
  expect(Type.getFields()).toHaveProperty(field);
  expect(Type.getFields()[field].type).toEqual(type);
};

const checkTermInt = (field) => checkCustomType(Term, field, GraphQLInt);
const checkTermString = (field) => checkCustomType(Term, field, GraphQLString);
const checkTermCustom = (field, type) => checkCustomType(Term, field, type);

const checkStatisticsString = (field) => checkCustomType(TermStatistics, field, GraphQLString);
const checkStatisticsInt = (field) => checkCustomType(TermStatistics, field, GraphQLInt);

const checkTagInt = (field) => checkCustomType(Tag, field, GraphQLInt);
const checkTagString = (field) => checkCustomType(Tag, field, GraphQLString);
const checkTagCustom = (field, type) => checkCustomType(Tag, field, type);

const checkSegmentInt = (field) => checkCustomType(Segment, field, GraphQLInt);
const checkSegmentBool = (field) => checkCustomType(Segment, field, GraphQLBoolean);
const checkSegmentString = (field) => checkCustomType(Segment, field, GraphQLString);
const checkSegmentCustom = (field, type) => checkCustomType(Segment, field, type);

const checkBackupInt = (field) => checkCustomType(Backup, field, GraphQLInt);
const checkBackupString = (field) => checkCustomType(Backup, field, GraphQLString);

describe('Schema Types', () => {
  describe('Term', () => {
    it('Should have id of type integer', checkTermInt('id'));
    it('Should have createdAt of type string', checkTermString('createdAt'));
    it('Should have updatedAt of type string', checkTermString('updatedAt'));
    it('Should have side1 of type string', checkTermString('side1'));
    it('Should have side2 of type string', checkTermString('side2'));
    it('Should have side3 of type string', checkTermString('side3'));
    it('Should have translation of type string', checkTermString('translation'));
    it('Should have partOfSpeech of type string', checkTermString('partOfSpeech'));
    it('Should have notes of type string', checkTermString('notes'));
    it('Should have an array of type Tag', checkTermCustom('tags', GraphQLList(Tag)));
    it('Should have statistics of type Statistics', checkTermCustom('statistics', TermStatistics));
    it('Should have an array of type Segment', checkTermCustom('segments', GraphQLList(Segment)));
  });
  describe('Statistics', () => {
    it('Should have firstStudied of type string', checkStatisticsString('firstStudied'));
    it('Should have lastStudied of type string', checkStatisticsString('lastStudied'));
    it('Should have durationStudied of type string', checkStatisticsInt('durationStudied'));
    it('Should have occurrencesStudied of type int', checkStatisticsInt('occurrencesStudied'));
    it('Should have side1_correct of type int', checkStatisticsInt('side1_correct'));
    it('Should have side2_correct of type int', checkStatisticsInt('side2_correct'));
    it('Should have side3_correct of type int', checkStatisticsInt('side3_correct'));
    it('Should have side1_unknown of type int', checkStatisticsInt('side1_unknown'));
    it('Should have side2_unknown of type int', checkStatisticsInt('side2_unknown'));
    it('Should have side3_unknown of type int', checkStatisticsInt('side3_unknown'));
    it('Should have side1_wrong of type int', checkStatisticsInt('side1_wrong'));
    it('Should have side2_wrong of type int', checkStatisticsInt('side2_wrong'));
    it('Should have side3_wrong of type int', checkStatisticsInt('side3_wrong'));
  });
  describe('Tag', () => {
    it('Should have id of type integer', checkTagInt('id'));
    it('Should have createdAt of type string', checkTagString('createdAt'));
    it('Should have updatedAt of type string', checkTagString('updatedAt'));
    it('Should have name of type string', checkTagString('name'));
    it('Should have terms of type string', checkTagCustom('terms', GraphQLList(Term)));
  });
  describe('Segment', () => {
    it('Should have id of type integer', checkSegmentInt('id'));
    it('Should have batchId of type integer', checkSegmentInt('batchId'));
    it('Should have termId of type integer', checkSegmentInt('termId'));
    it('Should have start of type string', checkSegmentString('start'));
    it('Should have end of type string', checkSegmentString('end'));
    it('Should have usedSide1 of type boolean', checkSegmentBool('usedSide1'));
    it('Should have usedSide2 of type boolean', checkSegmentBool('usedSide2'));
    it('Should have usedSide3 of type boolean', checkSegmentBool('usedSide3'));
    it('Should have correct of type boolean', checkSegmentBool('correct'));
    it('Should have unknown of type boolean', checkSegmentBool('unknown'));
    it('Should have wrong of type boolean', checkSegmentBool('wrong'));
    it('Should have term of type boolean', checkSegmentCustom('term', Term));
  });
  describe('Backup', () => {
    it('Should have downloadUrl of type integer', checkBackupString('downloadUrl'));
    it('Should have year of type string', checkBackupInt('year'));
    it('Should have month of type string', checkBackupInt('month'));
    it('Should have day of type string', checkBackupInt('day'));
    it('Should have hour of type string', checkBackupInt('hour'));
    it('Should have minute of type string', checkBackupInt('minute'));
  });
});
