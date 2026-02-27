import type { JsonValue } from '@/types/json';
import yaml from 'yaml';

export function jsonToYaml(data: JsonValue): string {
  return yaml.stringify(data);
}
