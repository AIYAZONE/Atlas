# 角色/权限矩阵与 Supabase RLS 策略模板

## 角色与资源
- 角色：Admin、Editor、Publisher、Viewer、Service
- 资源域：content（内容类型/条目）、media（媒体）、publish（发布）、settings（站点与构建配置）、commerce（orders/customers）
- 操作：read、create、update、delete、publish、approve、rollback、configure

## 权限矩阵（摘要）
- Admin：所有资源的读写/配置/发布/回滚；审批敏感操作；管理角色与成员
- Editor：内容与媒体的读写；无发布权限；可提交审核
- Publisher：内容读写与发布/回滚；不可更改系统配置
- Viewer：只读已发布内容与公开媒体；无写操作
- Service：系统任务（构建、派生图、Webhook 入库）；最小权限执行

## 声明与鉴权约定
- JWT Claims：user_id、org_id、role、permissions[]
- 多租户：所有业务数据带 org_id；RLS 按 org_id + role 控制
- 发布态：内容含 status 字段（draft/approved/published/archived）与 version

## RLS 策略模板（content 表）
- 只读已发布（Viewer）：

```sql
create policy view_published_content
on content for select
using (
  status = 'published'
  and org_id = current_setting('request.jwt.claims', true)::jsonb ->> 'org_id' = org_id::text
);
```

- 组织范围读写（Editor/Publisher/Admin）：

```sql
create policy org_read_content
on content for select
using (
  org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid
);

create policy org_write_content
on content for insert
with check (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'role') in ('Editor','Publisher','Admin')
  and org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid
);

create policy org_update_content
on content for update
using (
  org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid
)
with check (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'role') in ('Editor','Publisher','Admin')
);
```

- 发布（Publisher/Admin）：

```sql
create policy publish_content
on content for update
using (
  org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid
  and (current_setting('request.jwt.claims', true)::jsonb ->> 'role') in ('Publisher','Admin')
)
with check (status in ('approved','published'));
```

## RLS 策略模板（media 表）
- 组织范围读写，Viewer 只读已公开：

```sql
create policy media_select
on media for select
using (
  org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid
  or (is_public = true and status = 'published')
);

create policy media_insert_update
on media for all
using (
  org_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::uuid
)
with check (
  (current_setting('request.jwt.claims', true)::jsonb ->> 'role') in ('Editor','Publisher','Admin')
);
```

## 审计与敏感操作
- 审计表记录：actor_id、org_id、resource、operation、old/new、version、timestamp
- 双人复核：发布、回滚、删除媒体需审批；通过工作流表记录 state 与 approver_id

## 迁移到后端网关的策略
- 保留最小 RLS（org_id 隔离与发布只读），将细粒度权限与审批迁移至后端网关（NestJS Guards + Policy Engine）

