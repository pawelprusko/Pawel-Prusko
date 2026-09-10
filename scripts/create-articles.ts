import * as fs from 'fs';
import * as path from 'path';

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; // 1x1 png

const categories = [
  { id: 'data-alchemist-journal', name: 'Data Alchemist Journal' },
  { id: 'data-architecture-scrolls', name: 'Data Architecture Scrolls' },
  { id: 'data-psychology-notes', name: 'Data Psychology Notes' },
  { id: 'data-ecology-memos', name: 'Data Ecology Memos' },
  { id: 'data-brand-diary', name: 'Data Brand Diary' }
];

const content = {
  "title": "The Trophic Cascade of Proxy Metrics: Why Your North Star is Blinding the Ecosystem",
  "excerpt": "A deep dive into why your dashboard fails not because of the data it shows, but the data it doesn't allow to breathe.",
  "content": "In deep ecology, there is a phenomenon known as a trophic cascade. The most famous example occurred in Yellowstone National Park. For decades, the ecosystem was dying. The riverbanks were eroding, the flora was vanishing, and the landscape was decaying into entropic chaos. The solution was not to plant more trees or build artificial dams. The solution was the reintroduction of a single apex predator: the wolf.<br><br>The wolves hunted the elk. The elk, no longer able to graze idly on the riverbanks, moved to the forests. The willow and aspen trees on the banks regenerated. The roots of those trees stabilized the soil. The stabilized soil stopped the erosion, literally changing the physical course of the rivers.<br><br>A single intervention at the top of the hierarchy fundamentally altered the physics of the environment.<br><br>We must understand that an executive dashboard is not merely a digital mirror reflecting reality. It is the apex predator of your organizational ecosystem. The pixels you choose to elevate on a screen dictate the metabolic flow of human effort. And right now, the way we design these interfaces is causing a massive, invisible ecological collapse within our companies.<br><br>The Dysfunction: The Proxy-Metric Contagion<br><br>We have entered an era of unprecedented analytical capability, where AI models can synthesize thousands of variables into a single, elegant number. Let’s call it the \"Customer Health Score\" or the \"Global Efficiency Index.\"<br><br>From a purely aesthetic standpoint, placing this single, glowing metric at the top-center of a dashboard feels like a triumph of User Experience. It is clean. It is digestible. It removes cognitive friction.<br><br>But beneath the surface of this design choice lies a severe organizational dysfunction: The Proxy-Metric Contagion.<br><br>When a synthetic metric dominates the visual hierarchy of the UI, it ceases to be a measurement; it becomes a mandate. Human beings are biological algorithms optimized for survival, and in a corporate setting, survival means aligning with what the interface tells them the leadership values.<br><br>Because this one metric dominates the screen, the entire organization—regardless of official strategy documents—subconsciously begins to optimize its behavior to serve that specific number. This is organizational game theory in its purest form. If the interface does not visualize the friction required to achieve that number, teams will cannibalize invisible metrics to feed the visible one. They will burn out their staff, degrade long-term brand equity, or bypass critical quality controls, all to ensure the \"North Star\" metric flashes green.<br><br>The UI design itself dictates a destructive physics. By hyper-focusing on a single species of data, we cause a trophic cascade that destroys the hidden, unmeasured processes that actually keep the company alive.<br><br>\"Entropy is the natural state of data. But the most dangerous form of entropy is not messy data; it is the silent decay of the unmeasured ecosystem, sacrificed at the altar of a single, over-optimized KPI.\"<br><br>The Burden of the North Star<br><br>Before we critique the architecture, we must understand the architect. Why do smart, capable executives demand these hyper-simplified, single-metric dashboards?<br><br>It is not out of ignorance, nor is it a lack of analytical maturity. It is rooted in a profound, heavy burden of responsibility. In a fragmented, siloed, and highly volatile enterprise, the cognitive debt placed on a leader is staggering. The demand for a \"North Star Metric\" is a rational, deeply human defense mechanism.<br><br>Leaders ask for these simplified views because they crave a unified vector. They are trying to cut through the deafening noise of organizational friction and find a single, clean signal that can align thousands of employees. The desire to condense complexity into a single score is an act of protective leadership—an attempt to create a shared reality and shield the organization from decision paralysis.<br><br>I understand this burden. I validate the noble intention behind it. But we must have the courage to admit that this specific defense mechanism is fundamentally dangerous.<br><br>By demanding a dashboard that hides the friction and complexity of reality, you are not protecting your team. You are blinding them to the ecosystem. Great leadership is not about forcing the world into a single, comfortable number. Great leadership is about designing an environment where the complex, sometimes uncomfortable truth can surface and be navigated.<br><br>Data Experience Design: Ecosystem Management<br><br>How do we fix this? The answer lies in the holistic integration of Data Experience Design. We must shift our mental model from being \"Dashboard Builders\" to being \"Ecosystem Managers.\"<br><br>We cannot simply add more charts to the screen. That only increases the cognitive allostatic load, pushing the nervous system of the organization into a state of permanent analytical vigilance. Instead, we must fundamentally change the relationship between the metrics we visualize.<br><br>This requires the implementation of The Rule of Paired Metrics.<br><br>In the natural world, every action has a biological cost. In Data Experience Design, every metric of success must be visually tethered to its corresponding metric of friction. We must strictly forbid the visualization of critical KPIs in isolation.<br><br>You do not need custom code or complex software to achieve this. In standard, everyday BI tools, this is an exercise in intentional layout and visual storytelling:<br><br>The Dual-Axis Reality: If you show a bar chart of 'Sales Volume' (the success), it must be overlaid with a line representing 'Customer Acquisition Cost' or 'Employee Overtime Hours' (the friction).<br><br>The Scatter Plot Ecosystem: Instead of showing a giant KPI scorecard, force the data into a scatter plot where the X-axis is the output and the Y-axis is the systemic cost.<br><br>By designing the interface this way, the color, size, and position of the data tell a complete story. We remove the cognitive affordance for \"blind optimization.\" When the leader looks at the screen, they do not see a single number to be maximized; they see a delicate balance to be managed.<br><br>The visual design forces the brain to process the trade-offs. It acts as a cognitive dampener against reckless, single-minded actions. We teach the system to see the wolves, the elk, and the river all at once.<br><br>The Architectural Question<br><br>We build our information systems believing they are neutral observers of our business. They are not. They are the invisible architecture of our culture, dictating where attention flows, how fear is distributed, and what sacrifices are deemed acceptable.<br><br>When you design for an ecosystem, you acknowledge that everything is connected. When you design for a North Star, you are actively choosing to ignore the shadows it casts.<br><br>Look at the primary screen you use to steer your organization today. Ask yourself: What vital, silent parts of your ecosystem are currently being starved, simply because your interface hasn't given them the pixels to survive?"
};

const articlesDir = path.join(process.cwd(), 'src/articles');
if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
}

categories.forEach((cat, i) => {
    const dir = path.join(articlesDir, cat.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Create hero.png
    const pngBuffer = Buffer.from(base64Png, 'base64');
    fs.writeFileSync(path.join(dir, 'hero.png'), pngBuffer);
    
    // Create article.json
    // Modifying ID and title slightly maybe so they don't look completely identical, or same id?
    // User said "wrzuć tego samego jason którego conent załączam"
    const articleJson = {
        id: cat.id + "-1",
        title: content.title,
        slug: "trophic-cascade-" + cat.id,
        excerpt: content.excerpt,
        content: content.content,
        categoryId: cat.id,
         // The category name itself from Categories
        category: cat.name,
        date: "2026-06-01T10:00:00Z"
    };

    fs.writeFileSync(path.join(dir, 'article.json'), JSON.stringify(articleJson, null, 2));
});

console.log("Articles created.");
