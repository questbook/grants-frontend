import * as anchor from '@project-serum/anchor';

export default class Questbook {
  program: anchor.Program
  provider: anchor.AnchorProvider
  signer: anchor.AnchorProvider

  constructor(program: anchor.Program, provider: anchor.AnchorProvider) {
    this.program = program
    this.provider = provider
    this.signer = provider
    anchor.setProvider(provider)
  }

  async rpcInitProgram(authority: anchor.web3.PublicKey) {
    const [programAcc, _programBump] = await this.getProgramAccount()
    await this.program.rpc.initialize(authority, {
      accounts: {
        programInfo: programAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    })
  }

  async createWorkspace(metadataHash: string, adminEmail: string, authority?: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
    const workspace = anchor.web3.Keypair.generate()
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace.publicKey, 0)
    const signers = [workspace]
    if (authority) {
      signers.push(authority)
    }

    await this.program.rpc.createWorkspace(metadataHash, adminEmail, {
      accounts: {
        workspace: workspace.publicKey,
        workspaceOwner: authority != null ? authority.publicKey : this.provider.wallet.publicKey,
        workspaceAdmin: workspaceAdminAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers
    })

    return workspace.publicKey
  }

  async updateWorkspace(workspace: anchor.web3.PublicKey, metadataHash: string, adminId: number, authority?: anchor.web3.Keypair) {
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)
    const signers = []
    if (authority) {
      signers.push(authority)
    }

    await this.program.rpc.updateWorkspace(metadataHash, adminId, {
      accounts: {
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: authority != null ? authority.publicKey : this.provider.wallet.publicKey,
      },
      signers
    })
  }

  async addWorkspaceAdmin(
    workspace: anchor.web3.PublicKey,
    workspaceAdminId: number,
    workspaceAdminAuthority: anchor.web3.Keypair,
    newAdminEmail: string,
    newAdminAuthority: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> {
    const workspaceState = await this.getWorkspaceState(workspace)
    const [workspaceAdminAcc, _w1] = await this.getWorkspaceAdminAccount(workspace, workspaceAdminId)
    const [newWorkspaceAdminAcc, _w2] = await this.getWorkspaceAdminAccount(workspace, workspaceState.adminIndex)
    await this.program.rpc.addWorkspaceAdmin(workspaceAdminId, newAdminEmail, newAdminAuthority, {
      accounts: {
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
        newWorkspaceAdmin: newWorkspaceAdminAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [workspaceAdminAuthority]
    })

    return newWorkspaceAdminAcc
  }

  async removeWorkspaceAdmin(
    workspace: anchor.web3.PublicKey,
    workspaceAdminId: number,
    workspaceAdminAuthority: anchor.web3.Keypair,
    removeAdminId: number,
  ) {
    const [workspaceAdminAcc, _w1] = await this.getWorkspaceAdminAccount(workspace, workspaceAdminId)
    const [removeWorkspaceAdminAcc, _w2] = await this.getWorkspaceAdminAccount(workspace, removeAdminId)

    await this.program.rpc.removeWorkspaceAdmin(workspaceAdminId, removeAdminId, {
      accounts: {
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
        removeWorkspaceAdmin: removeWorkspaceAdminAcc,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [workspaceAdminAuthority]
    })
  }

  async createGrant(adminId: number, metadataHash: string, workspace: anchor.web3.PublicKey, workspaceAdminAuthority?: anchor.web3.Keypair) {
    const grant = anchor.web3.Keypair.generate()
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)

    await this.program.rpc.createGrant(adminId, metadataHash, {
      accounts: {
        grant: grant.publicKey,
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: this.provider.wallet.publicKey,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [grant]
    })

    return grant.publicKey
  }

  async updateGrant(adminId: number, metadataHash: string, grant: anchor.web3.PublicKey, workspace: anchor.web3.PublicKey, workspaceAdminAuthority: anchor.web3.Keypair) {
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)

    await this.program.rpc.updateGrant(adminId, metadataHash, {
      accounts: {
        grant: grant,
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority.publicKey,
      },
      signers: [workspaceAdminAuthority]
    })
  }

  async updateGrantAccessibility(adminId: number, canAcceptApplications: boolean, grant: anchor.web3.PublicKey, workspace: anchor.web3.PublicKey, workspaceAdminAuthority?: anchor.web3.Keypair) {
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)

    await this.program.rpc.updateGrantAccessibility(adminId, canAcceptApplications, {
      accounts: {
        grant: grant,
        workspace: workspace,
        workspaceAdmin: workspaceAdminAcc,
        authority: workspaceAdminAuthority?.publicKey || this.provider.wallet.publicKey,
      },
      // signers: []
    })
  }

  async submitApplication(metadataHash: string, milestone_count: number, grant: anchor.web3.PublicKey, authority?: anchor.web3.Keypair) {
    const [applicationAcc, _w] = await this.getApplicationAccount(authority?.publicKey || this.provider.wallet.publicKey, grant)
    const signers = []
    if (authority) {
      signers.push(authority)
    }

    await this.program.rpc.submitApplication(metadataHash, milestone_count, {
      accounts: {
        application: applicationAcc,
        authority: authority != null ? authority.publicKey : this.provider.wallet.publicKey,
        grant: grant,
        payer: this.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers
    })
  }

  async updateApplicationState(
    grant: anchor.web3.PublicKey,
    workspace: anchor.web3.PublicKey,
    adminId: number,
    admin_authority: anchor.web3.Keypair,
    application_state: any,
    application_authority: anchor.web3.PublicKey
  ) {
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)
    const [applicationAcc, _x] = await this.getApplicationAccount(application_authority, grant)
    const signers = [admin_authority]

    await this.program.rpc.updateApplicationState(adminId, application_state, application_authority, {
      accounts: {
        grant: grant,
        workspaceAdmin: workspaceAdminAcc,
        authority: admin_authority.publicKey,
        application: applicationAcc,
      },
      signers
    })
  }

  async completeApplication(grant: anchor.web3.PublicKey, workspace: anchor.web3.PublicKey, adminId: number, applicationAuthority: anchor.web3.PublicKey, adminAuthority?: anchor.web3.Keypair) {
    const [workspaceAdminAcc, _w] = await this.getWorkspaceAdminAccount(workspace, adminId)
    const [applicationAcc, _x] = await this.getApplicationAccount(applicationAuthority, grant)

    await this.program.rpc.completeApplication(adminId, applicationAuthority, {
      accounts: {
        grant,
        workspaceAdmin: workspaceAdminAcc,
        authority: this.provider.wallet.publicKey,
        application:applicationAcc,
      },
      // signers
    })
  }

  async updateApplicationMetadata(grant: anchor.web3.PublicKey, metadataHash: string, milestoneCount: number, applicationAuthority?: anchor.web3.Keypair) {
    const [applicationAcc, _x] = await this.getApplicationAccount(applicationAuthority?.publicKey || this.provider.wallet.publicKey, grant)
    const signers = []
    if (applicationAuthority) {
      signers.push(applicationAuthority)
    }

    await this.program.rpc.updateApplicationMetadata(metadataHash, milestoneCount, {
      accounts: {
        grant,
        application: applicationAcc,
        authority: applicationAuthority?.publicKey || this.provider.wallet.publicKey
      },
      signers
    })
  }

  async requestMilestoneApproval(grant: anchor.web3.PublicKey, reasonMetadataHash: string, milestoneId: number, applicationAuthority?: anchor.web3.Keypair) {
    const [applicationAcc, _x] = await this.getApplicationAccount(applicationAuthority?.publicKey || this.provider.wallet.publicKey, grant)
    const signers = []
    if (applicationAuthority) {
      signers.push(applicationAuthority)
    }

    await this.program.rpc.requestMilestoneApproval(milestoneId, reasonMetadataHash, {
      accounts: {
        grant,
        application: applicationAcc,
        authority: applicationAuthority?.publicKey || this.provider.wallet.publicKey
      },
      signers
    })
  }

  async getWorkspaceState(pk: anchor.web3.PublicKey) {
    return this.program.account.workspace.fetch(pk)
  }

  async getGrantState(pk: anchor.web3.PublicKey) {
    return this.program.account.grant.fetch(pk)
  }

  async getWorkspaceAdminAccount(workspace: anchor.web3.PublicKey, adminId: number) {
    return anchor.web3.PublicKey.findProgramAddress([
      Buffer.from('workspace_admin'),
      workspace.toBuffer(),
      Buffer.from(adminId + '')
    ], this.program.programId)
  }

  async getWorkspaceAdminState(workspace: anchor.web3.PublicKey, adminId: number) {
    const [workspaceAdminAcc, _x] = await this.getWorkspaceAdminAccount(workspace, adminId)
    return this.program.account.workspaceAdmin.fetch(workspaceAdminAcc)
  }

  async getApplicationState(authority: anchor.web3.PublicKey, grant: anchor.web3.PublicKey) {
    const [applicationAcc, _w] = await this.getApplicationAccount(authority, grant)
    return this.program.account.application.fetch(applicationAcc)
  }

  async getApplicationAccount(authority: anchor.web3.PublicKey, grant: anchor.web3.PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress([
      Buffer.from('application'),
      grant.toBuffer(),
      authority.toBuffer(),
    ], this.program.programId)
  }

  async getProgramState() {
    const [programAcc, _programBump] = await this.getProgramAccount()
    return this.program.account.programInfo.fetch(programAcc)
  }

  async getProgramAccount() {
    return anchor.web3.PublicKey.findProgramAddress([
      Buffer.from('program_info')
    ], this.program.programId)
  }
}
