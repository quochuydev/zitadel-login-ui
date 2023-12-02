import configuration from '#/configuration';
import { Action } from '../auth.service';
import ZitadelService, {
  AddUserGrant,
  SearchGrantedProject,
} from '../zitadel.service';

const zitadelService = ZitadelService({
  host: configuration.zitadel.url,
});

export const grantPatientRole: Action = async (context) => {
  const { user, accessToken } = context;
  const {  projectId } = {projectId:''};

  if (!projectId || context.project.projectId !== projectId) {
    return;
  }

  const projects = await zitadelService
    .request<SearchGrantedProject>({
      url: '/management/v1/granted_projects/_search',
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-zitadel-orgid': user.orgId,
      },
      data: {},
    })
    .then((res) => res.result || []);

  const project = projects.find((e) => e.projectId === projectId);
  if (!project) throw new Error('Invalid project ID');

  await zitadelService.request<AddUserGrant>({
    url: '/management/v1/users/{userId}/grants',
    params: {
      userId: user.userId,
    },
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-zitadel-orgid': user.orgId,
    },
    data: {
      projectId: projectId,
      projectGrantId: project.grantId,
      roleKeys: ['PATIENT'],
    },
  });
};
