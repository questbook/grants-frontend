import { readFile, writeFile } from 'fs/promises'
import { load } from 'js-yaml'
import { compile } from 'json-schema-to-typescript'
import path from 'path'

const GEN_TYPES_FILE = './src/types/gen.d.ts'

async function main() {
	const schema = await readYaml<any>('src/libraries/validator/schema.yaml')
	// console.log('Generating types for schema...', schema)
	const result = await compile(schema.Validations, 'Schema', {
		maxItems: -1,
		$refOptions: {
			resolve: {
				file: {
					read: (file) => {
						const parsed = path.parse(file.url)
						return schema[parsed.name]
					}
				}
			}
		}
	})
	await writeFile(GEN_TYPES_FILE, result)
}

async function readYaml<T>(file: string) {
	const yaml = await readFile(file, { encoding: 'utf-8' })
	return load(yaml) as T
}

main()