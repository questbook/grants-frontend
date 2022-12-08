import schema from 'src/libraries/validator/schema.yaml'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import Ajv from "ajv"
import addFormats from 'ajv-formats'
import $RefParser from "@apidevtools/json-schema-ref-parser";

const schemaJson = JSON.parse(JSON.stringify(schema))
console.log("Schema loaded", schemaJson)

let ajv = new Ajv({logger: false })
ajv = addFormats(ajv)
ajv.addFormat('hex', /^0x[0-9a-fA-F]+$/)
ajv.addFormat('integer', () => true)


$RefParser.dereference(schemaJson, (err, schema) => {
	if (err) {
	  console.error(err);
	}
	else {
	  // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
	  // including referenced files, combined into a single object
	  console.log('Schema dereferenced', schemaJson);
	  for(const key in schemaJson) {
		console.log("Adding schema", key, schemaJson[key])
	
		ajv.addSchema(schemaJson[key], key)
	}
	}
  })





export async function validateRequest(
	type: 'GrantUpdateRequest' | 'GrantCreateRequest' | 'RubricSetRequest',
	data: any
) {
	const _validate = await ajv.getSchema(type)!
	console.log('validate', _validate)
	if(!_validate(data)) {
		throw new Error(JSON.stringify(_validate.errors, undefined, 2))
	}
}

export async function validateAndUploadToIpfs(
	type: 'GrantUpdateRequest' | 'GrantCreateRequest',
	data: any
) {
	await validateRequest(type, data)
	const result = await uploadToIPFS(JSON.stringify(data))
	return result
}