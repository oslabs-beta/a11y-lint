import { Issue } from '../../types/issue';
import { HtmlExtractedNode } from '../../types/html';

export function mediaRules(elements: HtmlExtractedNode[]): Issue[] {
  const issues: Issue[] = [];

  for (const el of elements) {
    if (!el.location) {continue;}

    // Rule 1: audio must have a transcript nearby
    if (el.type === 'audio') {
      const hasTranscript = elements.some(sibling =>
        sibling.type === 'div' &&
        sibling.attributes?.['class']?.value.includes('transcript')
      );

      if (!hasTranscript) {
        issues.push({
          line: el.location.startLine,
          column: el.location.startColumn,
          endLine: el.location.endLine,
          endColumn: el.location.endColumn,
          message: '<audio> is missing a transcript for accessibility.',
          severity: 'error'
        });
      }
    }

    // Rule 2: audio or video must NOT autoplay
    if ((el.type === 'audio' || el.type === 'video') && el.attributes?.['autoplay']) {
      const autoplayLoc = el.attributes['autoplay'].location || el.location;
      issues.push({
        line: autoplayLoc.startLine,
        column: autoplayLoc.startColumn,
        endLine: autoplayLoc.endLine,
        endColumn: autoplayLoc.endColumn,
        message: `<${el.type}> should not use autoplay for accessibility reasons.`,
        severity: 'error'
      });
    }

    // Rule 3: audio or video must have controls
    if ((el.type === 'audio' || el.type === 'video') && !el.attributes?.['controls']) {
      issues.push({
        line: el.location.startLine,
        column: el.location.startColumn,
        endLine: el.location.endLine,
        endColumn: el.location.endColumn,
        message: `<${el.type}> is missing the 'controls' attribute, which is required for accessibility.`,
        severity: 'error'
      });
    }
    

    // Rule 4: video must be pausable
    if (el.type === 'video' && !el.attributes?.['controls']) {
      issues.push({
        line: el.location.startLine,
        column: el.location.startColumn,
        endLine: el.location.endLine,
        endColumn: el.location.endColumn,
        message: '<video> must include a way to be paused — add controls or a custom pause button.',
        severity: 'error'
      });
    }

    // ✅ Rule 5: Ensure proper media control markup (at least 'controls')
    if ((el.type === 'audio' || el.type === 'video') && !el.attributes?.['controls']) {
      issues.push({
        line: el.location.startLine,
        column: el.location.startColumn,
        endLine: el.location.endLine,
        endColumn: el.location.endColumn,
        message: `<${el.type}> must use appropriate markup for media controls.`,
        severity: 'error'
      });
    }
  }

  return issues;
}


export default mediaRules;
