import { apiClient } from "../../../lib/http";
import { TranslationApiMethod } from "../../../constant/MethodNames";
import type {
  CreateTranslationPayload,
  TranslationResponse,
} from "../../../domain/translation/translationDomains";

/**
 * Upload API fonksiyonları.
 * Dosya yükleme işlemleri form-data ile yapılır.
 */

export async function uploadAndTranslate(
  payload: CreateTranslationPayload
): Promise<TranslationResponse> {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("targetLang", payload.targetLang);

  const response = await apiClient.postFormData<TranslationResponse>(
    TranslationApiMethod.CREATE,
    formData
  );
  return response.data;
}
