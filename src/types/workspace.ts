import { SupportedChainId } from 'src/constants/chains';

export interface WorkspaceData {
  name: string;
  description: string;
  image: string | File;
  network: SupportedChainId;
  id?: string;
}

export interface WorkspaceMemberData {
  memberAddress: string;
  memberEmail: string;
}
