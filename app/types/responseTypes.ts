interface DatabaseAttributes {
    id: number;
    server: number;
    host: number;
    database: string;
    username: string;
    remote: string;
    max_connections: number;
    created_at: string;
    updated_at: string;
}

interface Database {
    object: "databases";
    attributes: DatabaseAttributes;
}

interface ContainerEnvironment {
    SERVER_JARFILE: string;
    VANILLA_VERSION: string;
    STARTUP: string;
    P_SERVER_LOCATION: string;
    P_SERVER_UUID: string;
}

interface Container {
    startup_command: string;
    image: string;
    installed: boolean;
    environment: ContainerEnvironment;
}

interface ServerLimits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: number | null;
}

interface FeatureLimits {
    databases: number;
    allocations: number;
    backups: number;
}

interface ServerAttributes {
    id: number;
    external_id: string;
    uuid: string;
    identifier: string;
    name: string;
    description: string;
    suspended: boolean;
    limits: ServerLimits;
    feature_limits: FeatureLimits;
    user: number;
    node: number;
    allocation: number;
    nest: number;
    egg: number;
    pack: number | null;
    container: Container;
    updated_at: string;
    created_at: string;
    relationships: {
        databases: {
            object: "list";
            data: Database[];
        };
    };
}

export interface Server {
    object: "server";
    attributes: ServerAttributes;
}

interface Pagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: Record<string, unknown>;
}

interface Meta {
    pagination: Pagination;
}

export interface ServerList {
    object: "list";
    data: Server[];
    meta: Meta;
}

interface UserAttributes {
    id: number;
    external_id: string;
    uuid: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    language: string;
    root_admin: boolean;
    "2fa": boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    object: "user";
    attributes: UserAttributes;
}

interface ConfigFile {
    parser: string;
    find: {
        "listeners[0].query_enabled": boolean;
        "listeners[0].query_port": string;
        "listeners[0].host": string;
        "servers.*.address": {
            "127.0.0.1": string;
            localhost: string;
        };
    };
}

interface ConfigStartup {
    done: string;
    userInteraction: string[];
}

interface ConfigLogs {
    custom: boolean;
    location: string;
}

interface Config {
    files: {
        "config.yml": ConfigFile;
    };
    startup: ConfigStartup;
    stop: string;
    logs: ConfigLogs;
    extends: null | string;
}

interface Script {
    privileged: boolean;
    install: string;
    entry: string;
    container: string;
    extends: null | string;
}

interface EggAttributes {
    id: number;
    uuid: string;
    name: string;
    nest: number;
    author: string;
    description: string;
    docker_image: string;
    config: Config;
    startup: string;
    script: Script;
    created_at: string;
    updated_at: string;
}

export interface Egg {
    object: "egg";
    attributes: EggAttributes;
}
