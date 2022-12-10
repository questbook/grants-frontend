import { writeFile } from 'fs/promises'
import { compile } from 'json-schema-to-typescript'
import path from 'path'
import { readYaml } from 'src/libraries/validator/utils/yaml'

const GEN_TYPES_FILE = './src/types/gen.d.ts';

(async() => {
	const schema = await readYaml<any>('src/libraries/validator/schema.yaml')
	console.log('Generating types for schema...', schema)
	const result = await compile(schema.Validations, 'Schema', {
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
})()