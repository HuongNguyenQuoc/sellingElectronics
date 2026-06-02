import { type DatabaseType } from "../driver/types/DatabaseType";
export { EventEmitter } from "events";
export { ReadStream } from "fs";
export { Readable, Writable } from "stream";
/**
 * Platform-specific tools.
 */
export declare class PlatformTools {
    /**
     * Type of the currently running platform.
     */
    static type: "browser" | "node";
    /**
     * Gets global variable where global stuff can be stored.
     */
    static getGlobalVariable(): any;
    /**
     * Reads the version string from package.json of the given package.
     * This operation is only supported in node.
     *
     * @param name
     */
    static readPackageVersion(name: string): string;
    /**
     * Loads ("require"-s) given file or package.
     * This operation only supports on node platform
     *
     * @param name
     */
    static load(name: string): any;
    /**
     * Normalizes given path. Does "path.normalize" and replaces backslashes with forward slashes on Windows.
     *
     * @param pathStr
     */
    static pathNormalize(pathStr: string): string;
    /**
     * Gets file extension. Does "path.extname".
     *
     * @param pathStr
     */
    static pathExtname(pathStr: string): string;
    /**
     * Resolved given path. Does "path.resolve".
     *
     * @param pathStr
     */
    static pathResolve(pathStr: string): string;
    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     *
     * @param pathStr
     */
    static fileExist(pathStr: string): boolean;
    static readFileSync(filename: string): Uint8Array;
    static appendFileSync(filename: string, data: any): void;
    static writeFile(path: string, data: any): Promise<void>;
    /**
     * Highlights sql string to be printed in the console.
     *
     * @param sql
     */
    static highlightSql(sql: string): string;
    /**
     * Pretty-print sql string to be print in the console.
     *
     * @param sql
     * @param dataSourceType
     */
    static formatSql(sql: string, dataSourceType?: DatabaseType): string;
    /**
     * Logging functions needed by AdvancedConsoleLogger
     *
     * @param prefix
     * @param info
     */
    static logInfo(prefix: string, info: any): void;
    static logError(prefix: string, error: any): void;
    static logWarn(prefix: string, warning: any): void;
    static log(message: string): void;
    static info(info: any): string;
    static error(error: any): string;
    static warn(message: string): string;
    static logCmdErr(prefix: string, err?: any): void;
}
