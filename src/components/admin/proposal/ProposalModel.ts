  
  export interface ProposalModel {
    pageNumber: number
    bodyHtml: string
    bodyCss: string
  }


  export interface ProposalPageModel {
    _id?: string
    title?: string
    tenantId?: string
    proposal_type?: ProposalType
    status?: "draft" | "published" | "archived"
      headerHtml?: string
      footerHtml?: string
      css?: string
    pages?: ProposalPageModel[] | null
    createdAt?: Date
    updatedAt?: Date
  }

  export type ProposalType = "standard" | "custom" | "template" | "blank"