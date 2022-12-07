import { readFile, writeFile } from 'fs/promises'
import { dump, load } from 'js-yaml'

export async function readYaml<T>(file: string) {
	const yaml = await readFile(file, { encoding: 'utf-8' })
	return load(yaml) as T
}

export async function writeYaml(file: string, contents: any) {
	const yaml = await dump(contents)
	await writeFile(file, yaml)
}