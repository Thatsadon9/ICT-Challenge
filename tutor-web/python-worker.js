/* A separate module worker keeps Python execution away from the interface. */
import {loadPyodide} from './assets/pyodide/pyodide.mjs';
let runtime;
async function initialize() {
  runtime = await loadPyodide({ indexURL: new URL('./assets/pyodide/', self.location.href).href });
  runtime.runPython(`
import sys as _t_sys, io as _t_io, json as _t_json, traceback as _t_traceback
from contextlib import redirect_stdout as _t_stdout, redirect_stderr as _t_stderr
class _TutorOutput(_t_io.StringIO):
    def write(self, value):
        if self.tell() + len(value) > 50000:
            raise RuntimeError("Output exceeds 50,000 characters. Check the loop and print statements.")
        return super().write(value)
def _tutor_execute(source, stdin_text):
    out, err = _TutorOutput(), _TutorOutput()
    old_stdin = _t_sys.stdin
    error = None
    try:
        _t_sys.stdin = _t_io.StringIO(stdin_text)
        with _t_stdout(out), _t_stderr(err):
            exec(compile(source, "<คำตอบของคุณ>", "exec"), {"__name__": "__main__"})
    except SystemExit as ex:
        if ex.code not in (None, 0):
            error = "SystemExit: " + str(ex.code)
    except BaseException:
        error = _t_traceback.format_exc(limit=6)
    finally:
        _t_sys.stdin = old_stdin
    return _t_json.dumps({"output": out.getvalue(), "stderr": err.getvalue(), "error": error})
`);
  self.postMessage({ type:'ready', version:runtime.runPython('_t_sys.version.split()[0]') });
}
const normalize = value => value.replace(/\r\n/g,'\n').split('\n').map(line=>line.trimEnd()).join('\n').trimEnd();
self.onmessage = async ({data}) => {
  if (data.type === 'init') {
    try { await initialize(); } catch (error) { self.postMessage({type:'error',message:String(error)}); }
    return;
  }
  if (data.type !== 'run' || !runtime) return;
  const results=[];
  self.postMessage({type:'running',id:data.id});
  try {
    for (let i=0; i<data.cases.length; i++) {
      const test = data.cases[i];
      runtime.globals.set('_t_source',data.code);
      runtime.globals.set('_t_input',test.input);
      const result=JSON.parse(runtime.runPython('_tutor_execute(_t_source, _t_input)'));
      result.passed = !result.error && (data.mode === 'run' || normalize(result.output) === normalize(test.output));
      result.name=test.name;
      results.push(result);
      self.postMessage({type:'case',id:data.id,index:i,passed:result.passed});
    }
    self.postMessage({type:'result',id:data.id,results});
  } catch (error) {
    self.postMessage({type:'error',id:data.id,message:String(error)});
  }
};
