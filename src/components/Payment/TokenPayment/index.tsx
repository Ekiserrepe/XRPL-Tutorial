import { useCallback } from 'react'
import { Payment } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  Invalid_DeliveredAmount: {
    ja: '送金額が一致しません。',
    en: 'The amount of USD sent does not match.',
  },
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
  },
} as const

/**
 * Pay Token to account
 */
export const TokenPayment = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<Payment>): Promise<OnSubmitReturnType> => {
      if (tx.meta?.TransactionResult === 'tesSUCCESS') {
        // OK
        // TODO: check if DeliveredAmount is 10 USD
        const delivered_amount = tx.meta?.delivered_amount
        if (
          typeof delivered_amount === 'object' &&
          delivered_amount.currency === 'USD' &&
          delivered_amount.value === '10'
        ) {
          return {
            success: true,
          }
        } else {
          return {
            success: false,
            message: translate('Invalid_DeliveredAmount'),
          }
        }
      } else {
        // NG
        return {
          success: false,
          message: translate('TransactionFailed'),
        }
      }
    },
    [translate]
  )

  return (
    <div>
      <TransactionCodeEditor<Payment>
        validTransactionType='Payment'
        json={{
          TransactionType: 'Payment',
          Account: account?.address || '',
          Destination: '',
          Amount: {
            issuer: 'rg2MAgwqwmV9TgMexVBpRDK89vMyJkpbC',
            currency: 'USD',
            value: '',
          },
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
