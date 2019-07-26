import {Inject, Injectable} from 'react-ts-di';

import {HTTP} from '../api';
import {TipStore} from '../store';
import {InjectStore} from '../utils';

interface OrganizationNames {
  organizeNames: string[];
}

@Injectable()
export class OrganizationService {
  @InjectStore(TipStore)
  private tipStore!: TipStore;

  @Inject
  private http!: HTTP;

  private organizationScope = 'organization';

  async getAllNames(): Promise<string[]> {
    const {organizeNames} = await this.http.get<OrganizationNames>(
      this.parseUrl('/name/all'),
    );

    return organizeNames;
  }

  async createOrganization(name: string, description: string): Promise<void> {
    try {
      await this.http.post<{}, string>(this.parseUrl('/new'), {
        name,
        description,
      });
    } catch (e) {
      this.tipStore.addTipToQueue('拉取信息失败', 'error');
    }
  }

  async hasExistOrganization(organizationName: string): Promise<boolean> {
    const names = await this.getAllNames();

    return names.includes(organizationName);
  }

  private parseUrl(path: string): string {
    return `${this.organizationScope}${path}`;
  }
}
