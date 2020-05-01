package com.appsmith.server.services;

import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.domains.Application;
import com.appsmith.server.dtos.OrganizationApplicationsDTO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ApplicationService extends CrudService<Application, String> {

    Mono<Application> findById(String id);

    Mono<Application> findById(String id, AclPermission aclPermission);

    Mono<Application> findByIdAndOrganizationId(String id, String organizationId);

    Mono<Application> findByName(String name);

    Mono<Boolean> publish(String applicationId);

    Mono<Application> save(Application application);

    Mono<Application> archive(Application application);

    Mono<List<OrganizationApplicationsDTO>> getAllApplications();
}
