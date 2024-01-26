export type testSchema = { 
	routines : {
		AllDataTypesProcedure: {
			parameters: [decimal_param: number | null]
		} ,
		MutationProcedure: {
			parameters: [test: string | null]
		}
	}
}