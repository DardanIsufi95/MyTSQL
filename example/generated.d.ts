export type GenerateSetCombinations<T extends string, U extends string = T> = T extends any ? `${T},${GenerateSetCombinations<Exclude<U, T>>}` | T : never;

export type testSchema = { 
	routines : {
		testis : {
			parameters : [
				test2 : number | null,
				vars : number | null
			] ,
			returns : any[][]
		} ,
		test_procedure : {
			parameters : [
				decimal_param : number | null,
				tiny_param : number | null,
				short_param : number | null,
				long_param : number | null,
				float_param : number | null,
				double_param : number | null,
				null_param : number | null,
				timestamp_param : Date | null,
				timestamp2_param : Date | null,
				longlong_param : number | null,
				int24_param : number | null,
				date_param : Date | null,
				time_param : Date | null,
				time2_param : Date | null,
				datetime_param : Date | null,
				datetime2_param : Date | null,
				year_param : number | null,
				newdate_param : Date | null,
				varchar_param : string | null,
				bit_param : 1 | 0 | null,
				json_param : string | null,
				newdecimal_param : number | null,
				enum_param : 'value1' | 'value2' | null,
				set_param : GenerateSetCombinations<'value1' | 'value2'> | null,
				tiny_blob_param : any,
				medium_blob_param : any,
				long_blob_param : any,
				blob_param : Buffer | null,
				var_string_param : string | null,
				string_param : string | null,
				geometry_param : Buffer | string
			] ,
			returns : any[][]
		}
	} ,
	tables : {
		data_type_showcase : {
			columns : {
				id : number,
				sample_int : number | null,
				sample_varchar : string | null,
				sample_char : string | null,
				sample_text : string | null,
				sample_blob : Buffer | null,
				sample_float : number | null,
				sample_double : number | null,
				sample_decimal : number | null,
				sample_boolean : number | null,
				sample_date : Date | null,
				sample_time : Date | null,
				sample_datetime : Date | null,
				sample_timestamp : Date | null,
				sample_year : number | null,
				sample_enum : 'value1' | 'value2' | 'value3' | null,
				sample_set : GenerateSetCombinations<'option1' | 'option2' | 'option3'> | null,
				sample_bit : 1 | 0 | null,
				sample_json : string | null,
				sample_tinyint : number | null,
				sample_smallint : number | null,
				sample_mediumint : number | null,
				sample_bigint : number | null,
				sample_longtext : string | null,
				sample_mediumtext : string | null,
				sample_tinytext : string | null,
				sample_binary : Buffer | null,
				sample_varbinary : Buffer | null,
				sample_geometry : Buffer | string,
				sample_point : Buffer | string,
				sample_linestring : Buffer | string,
				sample_polygon : Buffer | string,
				sample_multipoint : Buffer | string,
				sample_multilinestring : Buffer | string,
				sample_multipolygon : Buffer | string,
				sample_geometrycollection : Buffer | string
			}
		} ,
		test : {
			columns : {
				test : string
			}
		} ,
		users : {
			columns : {
				id : number,
				username : string
			}
		}
	}
}