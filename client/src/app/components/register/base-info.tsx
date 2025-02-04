import {observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ComponentType, ReactNode, createRef} from 'react';
import {Inject} from 'react-ts-di';
import styled from 'styled-components';

import {Regex, User} from '../../services';
import {
  Form,
  FormControl,
  FormTextField,
  FormTextFieldProps,
  Rules,
} from '../../ui';
import {Password} from '../access/password';
import {UserName} from '../access/username';

import {NextStep} from './common/buttons';
import {PartViewProps} from './common/part-view-props';

export const TextFieldWrapper = styled(FormTextField)`
  width: 300px;
  margin: 0 50px;
` as ComponentType<FormTextFieldProps>;

export interface BaseInfoData {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface BaseInfoProps {}

@observer
export class BaseInfo extends Component<BaseInfoProps & PartViewProps> {
  @observable
  private baseInfoData: BaseInfoData | undefined;

  @Inject
  private regex!: Regex;

  @Inject
  private userService!: User;

  private formControlRef = createRef<FormControl>();

  async handleNextStepClick(): Promise<void> {
    const result = this.formControlRef.current!.validate();

    if (!result) {
      return;
    }

    const isValid = await this.userService.validBaseInfo(this.baseInfoData!);

    console.info(isValid);

    // 没有校验数据完整性
    if (!isValid) {
      return;
    }

    this.props.onNextStepClick();

    console.info(this.baseInfoData);

    // if(this.baseInfoData){
    //   this.userService.collectBaseInfo(this.baseInfo),
    // }
  }

  get rules(): Rules {
    return {
      displayName: {
        errMsg: '昵称不能为空',
        required: true,
        validator: Form.Validators.minLengthValidator(2, '昵称'),
      },
      username: {
        errMsg: '用户名不能为空',
        required: true,
        validator: Form.Validators.minLengthValidator(4, '用户名'),
      },
      password: {
        errMsg: '密码不能为空',
        required: true,
        validator: Form.Validators.minLengthValidator(4, '密码'),
      },
      email: {
        errMsg: '邮箱不能为空',
        required: true,
        validator: (_rule, text, cb) => {
          if (!this.regex.test(Regex.Email, text)) {
            cb('请输入正确的邮箱格式');
          }
        },
      },
    };
  }

  render(): ReactNode {
    return (
      <>
        <FormControl
          ref={this.formControlRef}
          rules={this.rules}
          onFormDataChange={(data: BaseInfoData) => (this.baseInfoData = data)}
        >
          <TextFieldWrapper
            required
            name="displayName"
            label="昵称"
            type="text"
            autoComplete="new-password"
            placeholder="输入用于显示的昵称"
            inputProps={{
              maxLength: 10,
            }}
          />
          <UserName
            required
            name="username"
            inputProps={{
              maxLength: 20,
            }}
          />
          <Password
            required
            name="password"
            inputProps={{
              maxLength: 20,
            }}
          />
          <TextFieldWrapper
            required
            name="email"
            label="邮箱"
            type="email"
            placeholder="接收变更通知的邮箱"
            autoComplete="new-password"
          />
        </FormControl>
        <NextStep
          variant="contained"
          color="primary"
          onClick={() => this.handleNextStepClick()}
        >
          下一步
        </NextStep>
      </>
    );
  }
}
