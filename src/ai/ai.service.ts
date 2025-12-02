import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyzeVsJobDto } from './dto/analyze-vs-job.dto';
import { CoverLetterDto } from './dto/cover-letter.dto';
import { ImproveTextDto } from './dto/improve-text.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('OPENAI_API_KEY not set, AI features will be disabled');
    } else {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async improveText(improveTextDto: ImproveTextDto): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a professional technical writer. Rewrite the following text to be concise, metric-oriented, and suitable for inclusion in a resume and a public project page. Highlight technologies used and measurable outcomes. Tone: professional, clear.${
      improveTextDto.language ? ` Respond in ${improveTextDto.language}.` : ''
    }${improveTextDto.goal ? ` Goal: ${improveTextDto.goal}` : ''}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: improveTextDto.text },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || improveTextDto.text;
  }

  async generateCoverLetter(coverLetterDto: CoverLetterDto): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const resume = await this.prisma.resume.findUnique({
      where: { id: coverLetterDto.resumeId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: {
          select: {
            name: true,
            headline: true,
          },
        },
      },
    });

    if (!resume || !resume.versions[0]) {
      throw new Error('Resume not found');
    }

    const resumeContent = resume.versions[0].content;

    const systemPrompt = `You are a professional career coach. Write a compelling cover letter based on the provided resume and job description. The cover letter should be professional, concise (3-4 paragraphs), and highlight relevant experience and skills.`;

    const userPrompt = `Resume:\n${resumeContent}\n\nJob Description:\n${coverLetterDto.jobDescription}\n\nWrite a cover letter for this position.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeVsJob(analyzeDto: AnalyzeVsJobDto): Promise<{
    score: number;
    suggestions: string[];
    strengths: string[];
    missingKeywords: string[];
  }> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a professional resume reviewer. Compare a resume with a job description and provide:
1. A compatibility score from 0 to 1 (as a number)
2. Missing keywords that should be added
3. 5 specific suggestions to improve the resume for this role
4. Three one-line bullets summarizing strengths

Format your response as JSON with the following structure:
{
  "score": 0.0-1.0,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "strengths": ["strength1", "strength2", "strength3"]
}`;

    const userPrompt = `Resume:\n${analyzeDto.resumeText}\n\nJob Description:\n${analyzeDto.jobDescription}\n\nAnalyze and provide the comparison.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);

    return {
      score: result.score || 0,
      suggestions: result.suggestions || [],
      strengths: result.strengths || [],
      missingKeywords: result.missingKeywords || [],
    };
  }

  async generateProjectDescription(
    projectTitle: string,
    techStack: string[],
    prompt?: string,
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a professional technical writer. Generate a compelling project description for a portfolio. The description should be concise, highlight technologies used, and emphasize outcomes and impact.`;

    const userPrompt = `Project Title: ${projectTitle}\nTechnologies: ${techStack.join(', ')}\n${
      prompt ? `Additional context: ${prompt}` : ''
    }\n\nWrite a professional project description.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || '';
  }
}
