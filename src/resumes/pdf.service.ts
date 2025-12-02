import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(resumeId: string, userId: string): Promise<Buffer> {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: {
          select: {
            name: true,
            headline: true,
            email: true,
          },
        },
      },
    });

    if (!resume || resume.userId !== userId) {
      throw new Error('Resume not found or access denied');
    }

    const latestVersion = resume.versions[0];
    if (!latestVersion) {
      throw new Error('No resume version found');
    }

    const html = this.convertContentToHtml(latestVersion.content, resume.user);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private convertContentToHtml(content: string, user: any): string {
    const html = content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 30px; }
            h3 { color: #7f8c8d; }
            ul { list-style-type: disc; padding-left: 20px; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
          <header>
            <h1>${user.name || 'Resume'}</h1>
            ${user.headline ? `<p><strong>${user.headline}</strong></p>` : ''}
            ${user.email ? `<p>${user.email}</p>` : ''}
          </header>
          <main>
            ${html}
          </main>
        </body>
      </html>
    `;
  }
}
