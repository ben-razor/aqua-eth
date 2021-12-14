export function createSuccessInfo() {
  return { success: true, reason: 'ok', code: 0, message: ''};
}

export function createErrorInfo(reason='error', code=0, message='') {
  return { success: false, reason, code, message };
}

export function result(success, reason, code, message, data) {
  return { info: { success, reason, code, message }, data};
}