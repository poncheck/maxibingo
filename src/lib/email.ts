import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
    to: string | string[]
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'noreply@pregenetor.com',
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        })

        if (error) {
            console.error('Error sending email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

// Email Templates

export function betConfirmationEmail(params: {
    userName: string
    poolName: string
    predictedDate: string
    amount: string
    poolUrl: string
}) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Zakład Potwierdzony!</h1>
          </div>
          <div class="content">
            <p>Cześć ${params.userName}!</p>
            <p>Twój zakład został pomyślnie zarejestrowany.</p>
            
            <div class="details">
              <h3>Szczegóły zakładu:</h3>
              <p><strong>Pula:</strong> ${params.poolName}</p>
              <p><strong>Twoja typowana data:</strong> ${params.predictedDate}</p>
              <p><strong>Kwota:</strong> ${params.amount}</p>
            </div>

            <p>Możesz śledzić status puli i zobaczyć typy innych uczestników:</p>
            <a href="${params.poolUrl}" class="button">Zobacz Pulę</a>

            <p>Powodzenia! 🍀</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BabyBingo. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function newBetNotificationEmail(params: {
    creatorName: string
    participantName: string
    poolName: string
    currentTotal: string
    participantCount: number
    poolUrl: string
}) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { background: white; padding: 20px; border-radius: 5px; text-align: center; flex: 1; margin: 0 10px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Nowy Uczestnik!</h1>
          </div>
          <div class="content">
            <p>Cześć ${params.creatorName}!</p>
            <p><strong>${params.participantName}</strong> właśnie dołączył do Twojej puli zakładów!</p>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-value">${params.participantCount}</div>
                <div>Uczestników</div>
              </div>
              <div class="stat">
                <div class="stat-value">${params.currentTotal}</div>
                <div>Pula</div>
              </div>
            </div>

            <a href="${params.poolUrl}" class="button">Zobacz Szczegóły</a>
          </div>
        </div>
      </body>
    </html>
  `
}

export function winnerAnnouncementEmail(params: {
    userName: string
    isWinner: boolean
    winnerNames: string[]
    actualBirthDate: string
    payoutAmount?: string
    poolName: string
}) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${params.isWinner ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .winner-box { background: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0; border: 3px solid #f5576c; }
          .amount { font-size: 36px; font-weight: bold; color: #f5576c; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${params.isWinner ? '🎉 GRATULACJE! WYGRAŁEŚ!' : '👶 Dziecko się urodziło!'}</h1>
          </div>
          <div class="content">
            <p>Cześć ${params.userName}!</p>
            <p>Dziecko urodziło się <strong>${params.actualBirthDate}</strong>!</p>
            
            ${params.isWinner ? `
              <div class="winner-box">
                <h2>🏆 JESTEŚ ZWYCIĘZCĄ!</h2>
                <div class="amount">${params.payoutAmount}</div>
                <p>Wypłata zostanie przetworzona w ciągu 3-5 dni roboczych.</p>
              </div>
            ` : `
              <p>Zwycięzcy: <strong>${params.winnerNames.join(', ')}</strong></p>
              <p>Dziękujemy za udział w zabawie! 🎊</p>
            `}
          </div>
        </div>
      </body>
    </html>
  `
}

export function dailyEliminationEmail(params: {
    userName: string
    eliminatedDate: string
    currentPool: string
    remainingParticipants: number
    poolUrl: string
}) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .stats { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Dzienny Update</h1>
          </div>
          <div class="content">
            <p>Cześć ${params.userName}!</p>
            <p>Data <strong>${params.eliminatedDate}</strong> minęła bez narodzin dziecka.</p>
            
            <div class="stats">
              <p><strong>Aktualna pula:</strong> ${params.currentPool}</p>
              <p><strong>Pozostali uczestnicy:</strong> ${params.remainingParticipants}</p>
            </div>

            <p>Emocje rosną! 🎊</p>
            <a href="${params.poolUrl}">Zobacz szczegóły</a>
          </div>
        </div>
      </body>
    </html>
  `
}
