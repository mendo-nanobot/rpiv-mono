import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const packageDir = dirname(fileURLToPath(import.meta.url));

describe("skill frontmatter", () => {
	it("parses every shipped SKILL.md frontmatter block as YAML", () => {
		const skillsDir = join(packageDir, "skills");
		const skillFiles = readdirSync(skillsDir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => join(skillsDir, entry.name, "SKILL.md"))
			.filter((file) => existsSync(file));

		const parsed = skillFiles.map((file) => {
			const content = readFileSync(file, "utf8");
			const match = content.match(/^---\n([\s\S]*?)\n---\n/);
			expect(match, `${file} should have YAML frontmatter`).not.toBeNull();
			const frontmatter = parse(match![1]);
			expect(frontmatter?.name, `${file} should define a name`).toBeTruthy();
			expect(frontmatter?.description, `${file} should define a description`).toBeTruthy();
			return file;
		});

		expect(parsed.length).toBeGreaterThan(0);
	});
});
