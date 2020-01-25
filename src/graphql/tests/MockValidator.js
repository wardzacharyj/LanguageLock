const validateId = (value) => Number.isInteger(value) && value > 0;
const validateInteger = validateId;
const validBoolean = (value) => typeof value === 'boolean';
const validateDate = (value) => !!Date.parse(value);
const validateRequiredString = (value) => typeof value === 'string' && value.length > 0;
const validateOptionalString = (value) => typeof value === 'string' || value === null;

const validateOptionalArray = (value, itemValidator) => {
  if (!value || value.length === 0) {
    return true;
  }
  return value.reduce((accum, item) => accum && itemValidator(item), true);
};

const allValuesUnset = (item) => Object
  .values(item)
  .reduce((accum, value) => accum && value === null, true);

const validateTag = (tagItem) => validateId(tagItem.id)
    && validateDate(tagItem.createdAt)
    && validateDate(tagItem.updatedAt)
    && validateRequiredString(tagItem.name)
    && typeof tagItem.terms !== 'undefined';

const validateStatistics = (statisticsItem) => allValuesUnset(statisticsItem)
  || (
    validateDate(statisticsItem.firstStudied)
      && validateDate(statisticsItem.lastStudied)
      && validateInteger(statisticsItem.durationStudied)
      && validateInteger(statisticsItem.occurrencesStudied)
      && validateInteger(statisticsItem.side1_correct)
      && validateInteger(statisticsItem.side2_correct)
      && validateInteger(statisticsItem.side3_correct)
      && validateInteger(statisticsItem.side1_unknown)
      && validateInteger(statisticsItem.side2_unknown)
      && validateInteger(statisticsItem.side3_unknown)
      && validateInteger(statisticsItem.side1_wrong)
      && validateInteger(statisticsItem.side2_wrong)
      && validateInteger(statisticsItem.side3_wrong)
  );


const validateSegment = (segmentItem) => validateId(segmentItem.id)
  && validateId(segmentItem.batchId)
  && validateId(segmentItem.termId)
  && validateDate(segmentItem.start)
  && validateDate(segmentItem.end)
  && validBoolean(segmentItem.usedSide1)
  && validBoolean(segmentItem.usedSide2)
  && validBoolean(segmentItem.usedSide3)
  && validBoolean(segmentItem.correct)
  && validBoolean(segmentItem.unknown)
  && validBoolean(segmentItem.wrong);

const validateTerm = (termItem) => validateId(termItem.id)
  && validateDate(termItem.createdAt)
  && validateDate(termItem.updatedAt)
  && validateRequiredString(termItem.side1)
  && validateRequiredString(termItem.side2)
  && validateRequiredString(termItem.side3)
  && validateRequiredString(termItem.translation)
  && validateOptionalString(termItem.partOfSpeech)
  && validateOptionalString(termItem.notes)
  && validateOptionalArray(termItem.tags, validateTag)
  && (validateStatistics(termItem.statistics) || termItem.statistics === null)
  && validateOptionalArray(termItem.segments, validateSegment);

const MockValidator = {
  tag: validateTag,
  statistics: validateStatistics,
  segment: validateSegment,
  term: validateTerm,
};

export default MockValidator;
