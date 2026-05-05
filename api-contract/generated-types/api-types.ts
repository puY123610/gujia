// Checked-in handoff baseline for api-contract/openapi.yaml.
// Run `pnpm generate:types` after installing dependencies to regenerate this file.

export type PermissionLevel = 'Public' | 'UserAuth' | 'AdminAuth'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
}

export interface UserProfile {
  id: string
  nickname: string
  avatarUrl?: string
  role?: 'user' | 'admin'
}

export interface LoginRequest {
  phone: string
  password: string
}

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface LoginResponseData {
  token: string
  user: UserProfile
}

export interface QuickEntry {
  title: string
  path: string
  iconUrl?: string
}

export interface HomeSummary {
  emergencyEntrances: QuickEntry[]
  hospitalEntrance: QuickEntry
  lostPetEntrance: QuickEntry
}

export interface EmergencyCategory {
  id: string
  name: string
  sort?: number
}

export interface EmergencyArticleSummary {
  id: string
  title: string
  categoryId: string
  coverUrl?: string
  summary?: string
}

export interface EmergencyArticleDetail extends EmergencyArticleSummary {
  content: string
  riskNotice?: string
}

export interface Hospital {
  id: string
  name: string
  phone?: string
  address: string
  longitude?: number
  latitude?: number
  openingHours?: string
}

export interface HospitalMutationRequest {
  name: string
  phone?: string
  address: string
  longitude?: number
  latitude?: number
  openingHours?: string
}

export type AuditStatus = 'pending' | 'approved' | 'rejected'
export type ContentStatus = AuditStatus | 'closed'

export interface LostPet {
  id: string
  petName: string
  lostTime: string
  lostAddress?: string
  contactPhone: string
  description?: string
  imageUrls?: string[]
  status: ContentStatus
}

export interface CreateLostPetRequest {
  petName: string
  lostTime: string
  lostAddress?: string
  contactPhone: string
  description?: string
  imageUrls?: string[]
}

export interface Adoption {
  id: string
  title: string
  contactPhone: string
  description?: string
  imageUrls?: string[]
  status: ContentStatus
}

export interface CreateAdoptionRequest {
  title: string
  contactPhone: string
  description?: string
  imageUrls?: string[]
}

export interface CommunityPost {
  id: string
  title: string
  content: string
  imageUrls?: string[]
  status: AuditStatus
}

export interface CreatePostRequest {
  title: string
  content: string
  imageUrls?: string[]
}

export interface CreateCommentRequest {
  content: string
}

export interface PetProfile {
  id: string
  name: string
  species: 'dog' | 'cat' | 'other'
  breed?: string
  birthday?: string
  avatarUrl?: string
}

export interface CreatePetRequest {
  name: string
  species: 'dog' | 'cat' | 'other'
  breed?: string
  birthday?: string
  avatarUrl?: string
}

export type UpdatePetRequest = Partial<CreatePetRequest>

export interface FavoriteRequest {
  targetType: 'emergencyArticle' | 'hospital' | 'lostPet' | 'adoption' | 'communityPost'
  targetId: string
  favorited: boolean
}

export interface UploadResponseData {
  fileUrl: string
  fileKey?: string
  contentType?: string
}

export interface AuditRequest {
  status: 'approved' | 'rejected'
  reason?: string
}

export interface ApiPaths {
  '/home': {
    get: { permission: 'Public'; response: ApiResponse<HomeSummary> }
  }
  '/emergency/categories': {
    get: { permission: 'Public'; response: ApiResponse<EmergencyCategory[]> }
  }
  '/emergency/articles': {
    get: { permission: 'Public'; response: ApiResponse<EmergencyArticleSummary[]> }
  }
  '/emergency/articles/{id}': {
    get: { permission: 'Public'; response: ApiResponse<EmergencyArticleDetail> }
  }
  '/hospitals': {
    get: { permission: 'Public'; response: ApiResponse<Hospital[]> }
  }
  '/hospitals/{id}': {
    get: { permission: 'Public'; response: ApiResponse<Hospital> }
  }
  '/lost-pets': {
    get: { permission: 'Public'; response: ApiResponse<PageResult<LostPet>> }
    post: { permission: 'UserAuth'; body: CreateLostPetRequest; response: ApiResponse<LostPet> }
  }
  '/adoptions': {
    get: { permission: 'Public'; response: ApiResponse<PageResult<Adoption>> }
    post: { permission: 'UserAuth'; body: CreateAdoptionRequest; response: ApiResponse<Adoption> }
  }
  '/community/posts': {
    get: { permission: 'Public'; response: ApiResponse<PageResult<CommunityPost>> }
    post: { permission: 'UserAuth'; body: CreatePostRequest; response: ApiResponse<CommunityPost> }
  }
  '/auth/login': {
    post: { permission: 'Public'; body: LoginRequest; response: ApiResponse<LoginResponseData> }
  }
  '/auth/me': {
    get: { permission: 'UserAuth'; response: ApiResponse<UserProfile> }
  }
  '/pets': {
    get: { permission: 'UserAuth'; response: ApiResponse<PetProfile[]> }
    post: { permission: 'UserAuth'; body: CreatePetRequest; response: ApiResponse<PetProfile> }
  }
  '/upload': {
    post: { permission: 'UserAuth'; response: ApiResponse<UploadResponseData> }
  }
  '/admin/auth/login': {
    post: { permission: 'Public'; body: AdminLoginRequest; response: ApiResponse<LoginResponseData> }
  }
  '/admin/users': {
    get: { permission: 'AdminAuth'; response: ApiResponse<PageResult<UserProfile>> }
  }
}
