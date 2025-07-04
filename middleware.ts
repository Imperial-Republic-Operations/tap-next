export { auth as middleware } from "@/auth"

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};