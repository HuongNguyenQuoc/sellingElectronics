import type { DataSource } from "../../data-source/DataSource";
import type { QueryRunner } from "../../query-runner/QueryRunner";
import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import type { ExpoDataSourceOptions } from "./ExpoDataSourceOptions";
export declare class ExpoDriver extends AbstractSqliteDriver {
    options: ExpoDataSourceOptions;
    constructor(dataSource: DataSource);
    disconnect(): Promise<void>;
    createQueryRunner(): QueryRunner;
    protected createDatabaseConnection(): Promise<any>;
    /**
     * Loads the `expo-sqlite` module when `options.driver` is not set. Extracted
     * as a method so tests can stub the module resolution without depending on
     * whether `expo-sqlite` happens to be installed in the workspace.
     *
     * A literal `require("expo-sqlite")` is used so Metro's static bundler picks
     * the dependency up at build time — `PlatformTools.load()` is a throwing
     * stub in the browser/React-Native build and cannot be used here.
     */
    protected requireExpoSqlite(): unknown;
    /**
     * If driver dependency is not given explicitly, resolve it via
     * `requireExpoSqlite()` and validate that the loaded module exposes the
     * modern async API introduced in Expo SDK v52.
     */
    protected loadDependencies(): void;
}
