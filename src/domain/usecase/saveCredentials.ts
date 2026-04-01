import {ExchangeType, ExchangeDisplayName} from '../model/Exchange';
import type {IExchangeRepository} from '../repository/IExchangeRepository';

export interface CredentialEntry {
  exchange: ExchangeType;
  apiKey: string;
  secretKey: string;
}

export interface CredentialInput {
  apiKey: string;
  secretKey: string;
}

/**
 * 크리덴셜을 검증하고 저장하는 UseCase
 * Android SaveCredentialsUseCase에 대응
 *
 * 1. 저장 대상 결정 → 2. 입력값 검증 → 3. API 검증 → 4. 일괄 저장
 */
export async function saveCredentials(
  repo: IExchangeRepository,
  inputs: Record<string, CredentialInput>,
  selectedExchanges: ExchangeType[],
): Promise<void> {
  // 1. 비즈니스 규칙: 저장 대상 거래소 결정 (Upbit 필수 + 사용자 선택)
  const exchangeSet = new Set<ExchangeType>(selectedExchanges);
  exchangeSet.add(ExchangeType.UPBIT);
  const toSave = Array.from(exchangeSet);

  const entries: CredentialEntry[] = toSave.map(ex => ({
    exchange: ex,
    apiKey: inputs[ex]?.apiKey ?? '',
    secretKey: inputs[ex]?.secretKey ?? '',
  }));

  // 2. 빈칸 검증
  for (const e of entries) {
    if (!e.apiKey.trim() || !e.secretKey.trim()) {
      throw new ValidationError(
        `${ExchangeDisplayName[e.exchange]}의 API Key/Secret을 입력해주세요`,
      );
    }
  }

  // 3. 모든 거래소 API 검증 (하나라도 실패 시 저장하지 않음)
  for (const e of entries) {
    const valid = await repo.validateCredentials(
      e.exchange,
      e.apiKey,
      e.secretKey,
    );
    if (!valid) {
      throw new ValidationError(
        `${ExchangeDisplayName[e.exchange]} 연동 검증 실패. API Key/Secret을 확인하세요.`,
      );
    }
  }

  // 4. 모든 검증 성공 후 일괄 저장
  repo.replaceAllCredentials(entries);
}

/**
 * 개별 거래소 크리덴셜 삭제 UseCase
 */
export function deleteCredential(
  repo: IExchangeRepository,
  exchange: ExchangeType,
): void {
  repo.deleteCredentials(exchange);
}

/**
 * 로그아웃 UseCase
 */
export function logout(repo: IExchangeRepository): void {
  repo.clearAll();
}

/** 검증 에러 (사용자에게 보여줄 메시지 포함) */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
