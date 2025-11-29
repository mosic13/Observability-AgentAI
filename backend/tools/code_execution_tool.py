class CodeExecutionTool:
    name = "code_execution"

    def run(self, code: str):
        local_env = {}
        try:
            exec(code, {}, local_env)
            return {"result": local_env}
        except Exception as e:
            return {"error": str(e)}
