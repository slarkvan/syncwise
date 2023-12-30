// @vitest-environment happy-dom
import { beforeEach, expect, it, vi } from 'vitest';
import { oncePerHour } from '../oncePerHour';

beforeEach(() => {
  localStorage.clear();
});

it('basic', async () => {
  const mock = vi.fn();
  const f = oncePerHour(mock, 'mock');
  await f();
  await f();
  expect(mock.mock.calls.length).eq(1);
});

it('expire', async () => {
  const mock = vi.fn();
  const f = oncePerHour(mock, 'mock');
  await f();
  localStorage.setItem('mock', JSON.stringify({ date: '2021-01-01' }));
  await f();
  expect(mock.mock.calls.length).eq(2);
});
