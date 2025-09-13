// Accepts a rule tree like:
// { operator: 'AND', conditions: [ { field: 'totalSpend', op: '>', value: 10000 }, { operator: 'OR', conditions: [...] } ] }
// Returns a Mongo query object.

// function opToMongo(field, op, value) {
//     if (op === '>') return { [field]: { $gt: value } };
//     if (op === '>=') return { [field]: { $gte: value } };
//     if (op === '<') return { [field]: { $lt: value } };
//     if (op === '<=') return { [field]: { $lte: value } };
//     if (op === '==') return { [field]: value };
//     if (op === '!=') return { [field]: { $ne: value } };
//     if (op === 'in') return { [field]: { $in: Array.isArray(value) ? value : [value] } };
//     if (op === 'contains') return { [field]: { $regex: value, $options: 'i' } };
//     return {};
//   }
  
//   function buildMongoQuery(node) {
//     if (!node) return {};
//     if (node.operator && node.conditions) {
//       const sub = node.conditions.map(buildMongoQuery).filter(Boolean);
//       if (node.operator.toUpperCase() === 'AND') return { $and: sub };
//       if (node.operator.toUpperCase() === 'OR') return { $or: sub };
//     } else if (node.field && node.op) {
//       return opToMongo(node.field, node.op, node.value);
//     }
//     return {};
//   }
  
//   module.exports = { buildMongoQuery };

// backend/src/utils/ruleEngine.js

function parseValue(field, value) {
    if (value == null) return value;
  
    // Handle dates
    if (field.toLowerCase().includes("date")) {
      return new Date(value);
    }
  
    // Handle numbers
    if (!isNaN(value)) {
      return Number(value);
    }
  
    // Strings stay strings
    return value;
  }
  
  function opToMongo(field, op, value) {
    // Try to auto-cast value to number if field is numeric
    if (['totalSpend', 'visits'].includes(field)) {
      const num = Number(value);
      if (!isNaN(num)) value = num;
    }
  
    if (op === '>') return { [field]: { $gt: value } };
    if (op === '>=') return { [field]: { $gte: value } };
    if (op === '<') return { [field]: { $lt: value } };
    if (op === '<=') return { [field]: { $lte: value } };
    if (op === '==') return { [field]: value };
    if (op === '!=') return { [field]: { $ne: value } };
    if (op === 'in') return { [field]: { $in: Array.isArray(value) ? value : [value] } };
    if (op === 'contains') return { [field]: { $regex: value, $options: 'i' } };
    return {};
  }
  
  
  
  function buildMongoQuery(node) {
    if (!node) return {};
    if (node.operator && node.conditions) {
      const sub = node.conditions.map(buildMongoQuery).filter(Boolean);
      const query = node.operator.toUpperCase() === 'AND' ? { $and: sub } : { $or: sub };
      console.log("🔍 Built query (group):", JSON.stringify(query, null, 2));
      return query;
    } else if (node.field && node.op) {
      const q = opToMongo(node.field, node.op, node.value);
      console.log("🔍 Built query (condition):", JSON.stringify(q));
      return q;
    }
    return {};
  }
  
  
  module.exports = { buildMongoQuery };
  
  