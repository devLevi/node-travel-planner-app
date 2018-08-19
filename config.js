"use strict";

exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/travel-app";

exports.TESTDATABASE_URL =
  process.env.TESTDATABASE_URL || "mongodb://localhost/test-travel-app";

exports.PORT = process.env.PORT || 8080;
