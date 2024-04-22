import * as z from "zod";


export const ExposedPortSchema = z.object({
});
export type ExposedPort = z.infer<typeof ExposedPortSchema>;

export const LabelsSchema = z.object({
    "org.opencontainers.image.created": z.coerce.date(),
    "org.opencontainers.image.description": z.string(),
    "org.opencontainers.image.documentation": z.string(),
    "org.opencontainers.image.revision": z.string(),
    "org.opencontainers.image.source": z.string(),
    "org.opencontainers.image.title": z.string(),
    "org.opencontainers.image.url": z.string(),
    "org.opencontainers.image.version": z.string(),
});
export type Labels = z.infer<typeof LabelsSchema>;

export const PortBindingSchema = z.object({
    "HostIp": z.string(),
    "HostPort": z.string(),
});
export type PortBinding = z.infer<typeof PortBindingSchema>;

export const RestartPolicySchema = z.object({
    "Name": z.string(),
    "MaximumRetryCount": z.number(),
});
export type RestartPolicy = z.infer<typeof RestartPolicySchema>;

export const StateSchema = z.object({
    "Status": z.string(),
    "Running": z.boolean(),
    "Paused": z.boolean(),
    "Restarting": z.boolean(),
    "OOMKilled": z.boolean(),
    "Dead": z.boolean(),
    "Pid": z.number(),
    "ExitCode": z.number(),
    "Error": z.string(),
    "StartedAt": z.coerce.date(),
    "FinishedAt": z.coerce.date(),
});
export type State = z.infer<typeof StateSchema>;

export const ConfigSchema = z.object({
    "Hostname": z.string(),
    "Domainname": z.string(),
    "User": z.string(),
    "AttachStdin": z.boolean(),
    "AttachStdout": z.boolean(),
    "AttachStderr": z.boolean(),
    "ExposedPorts": z.record(z.string(), ExposedPortSchema),
    "Tty": z.boolean(),
    "OpenStdin": z.boolean(),
    "StdinOnce": z.boolean(),
    "Env": z.array(z.string()),
    "Cmd": z.null(),
    "Image": z.string(),
    "Volumes": z.null(),
    "WorkingDir": z.string(),
    "Entrypoint": z.array(z.string()),
    "Labels": LabelsSchema,
});
export type Config = z.infer<typeof ConfigSchema>;

export const HostConfigSchema = z.object({
    "NetworkMode": z.string(),
    "PortBindings": z.record(z.string(), z.array(PortBindingSchema)),
    "RestartPolicy": RestartPolicySchema,
    "AutoRemove": z.boolean(),
});
export type HostConfig = z.infer<typeof HostConfigSchema>;

export const NodeInfoSchema = z.object({
    "Id": z.string(),
    "Created": z.coerce.date(),
    "Path": z.string(),
    "Args": z.array(z.any()),
    "State": StateSchema,
    "Image": z.string(),
    "Name": z.string(),
    "RestartCount": z.number(),
    "Driver": z.string(),
    "Platform": z.string(),
    "ExecIDs": z.null(),
    "HostConfig": HostConfigSchema,
    "Mounts": z.array(z.any()),
    "Config": ConfigSchema,
});
export type NodeInfo = z.infer<typeof NodeInfoSchema>;

// Resource usage
export const ResourceUsageSchema = z.object({
    "ram_usage": z.number(),
    "cpu_usage": z.number(),
});
export type ResourceUsage = z.infer<typeof ResourceUsageSchema>;

export const ContainerStatsSchema = z.object({
    "name": z.string(),
    "id": z.string(),
    "image": z.string(),
    "resource_usage": ResourceUsageSchema,
    "ram_total": z.number(),
    "cpu_total": z.number(),
    "start_cmd": z.string(),
    "is_running": z.boolean(),
});
export type ContainerStats = z.infer<typeof ContainerStatsSchema>;

export const DbResponseSchema = z.object({
    "id": z.number(),
    "narwhalId": z.string(),
    "name": z.string(),
    "image": z.string(),
    "disk": z.number(),
    "ram": z.number(),
    "cpu": z.number(),
    "port": z.string(),
});
export type DbResponse = z.infer<typeof DbResponseSchema>;
