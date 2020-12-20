export class RpcError {
  public error
  public error_code
  public error_message
  public status
  constructor(inst: any = {}) {
    this.status = inst.status || "error"
    this.error = inst.error || "axiosIssue"
    this.error_code = inst.error_code || -9999
    this.error_message = inst.message || inst.error_message || "axios Issue."
  }
}
