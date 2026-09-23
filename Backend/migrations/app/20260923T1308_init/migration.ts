#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/818775bf05451d8eb945abb3327547c5664d0109ca89dce5464145836cf7bec4/contract';
import endContract from '../../snapshots/818775bf05451d8eb945abb3327547c5664d0109ca89dce5464145836cf7bec4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'attempt',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('problemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sessionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'evaluation',
        columns: [
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('errorMessage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('evaluatorType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('overallScore', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('result', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('submissionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'problem',
        columns: [
          col('constraints', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('difficulty', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('requirements', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('rubric', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'submission',
        columns: [
          col('attemptId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('code', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('diagram', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('explanation', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'evaluation',
        constraint: 'evaluation_submissionId_key',
        columns: ['submissionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'problem',
        constraint: 'problem_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'submission',
        constraint: 'submission_attemptId_key',
        columns: ['attemptId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attempt',
        index: 'attempt_problemId_idx_0024556d',
        columns: ['problemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attempt',
        index: 'attempt_sessionId_problemId_idx_eac919d4',
        columns: ['sessionId', 'problemId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'attempt',
        foreignKey: {
          name: 'attempt_problemId_fkey',
          columns: ['problemId'],
          references: { schema: 'public', table: 'problem', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'evaluation',
        foreignKey: {
          name: 'evaluation_submissionId_fkey',
          columns: ['submissionId'],
          references: { schema: 'public', table: 'submission', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'submission',
        foreignKey: {
          name: 'submission_attemptId_fkey',
          columns: ['attemptId'],
          references: { schema: 'public', table: 'attempt', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
