import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const guides = [
  {
    title: 'B-BBEE Basics Guide',
    description: 'Understanding the fundamentals of B-BBEE compliance',
    icon: 'book',
    category: 'Guide',
  },
  {
    title: 'Scorecard Calculator',
    description: 'Interactive tool to calculate your B-BBEE score',
    icon: 'calculator',
    category: 'Tool',
  },
  {
    title: 'Skills Development Guide',
    description: 'Comprehensive guide to skills development requirements',
    icon: 'graduation-cap',
    category: 'Guide',
  },
  {
    title: 'Document Templates',
    description: 'Essential templates for B-BBEE documentation',
    icon: 'file-text',
    category: 'Template',
  },
  {
    title: 'Verification Checklist',
    description: 'Prepare for your B-BBEE verification',
    icon: 'clipboard-check',
    category: 'Checklist',
  },
  {
    title: 'Legislative Updates',
    description: 'Stay current with B-BBEE legislation changes',
    icon: 'scroll',
    category: 'Updates',
  },
]

const categories = ['All', 'Guide', 'Tool', 'Template', 'Checklist', 'Updates']

export function Resources() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredGuides = guides.filter(
    (guide) => selectedCategory === 'All' || guide.category === selectedCategory
  )

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            B-BBEE Resources
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Access our comprehensive collection of guides, tools, and resources to support your B-BBEE compliance journey.
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="flex justify-center">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedCategory} className="mt-8">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredGuides.map((guide) => (
                  <Card key={guide.title} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon name={guide.icon} className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{guide.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {guide.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                      <Button className="w-full" variant="outline">
                        Access Resource
                        <Icon name="arrow-right" className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-16 bg-primary/5 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900">
                Need Expert Guidance?
              </h3>
              <p className="mt-2 text-gray-600">
                Our team of B-BBEE specialists is here to help you navigate compliance requirements.
              </p>
            </div>
            <Button size="lg" className="min-w-[200px]">
              Contact an Expert
              <Icon name="phone" className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 