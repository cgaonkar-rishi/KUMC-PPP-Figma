import { Book, FileText, Video, MessageCircle, Mail, Phone } from 'lucide-react';

export function Help() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-ku-blue rounded-lg shadow-md p-8 text-white">
        <h1 className="text-3xl mb-2">Help & Support</h1>
        <p className="text-blue-100">Find answers, tutorials, and get support for the Participant Payment Portal</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Book className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg mb-2">User Guide</h3>
          <p className="text-gray-600 text-sm mb-4">
            Comprehensive documentation on how to use all features of the portal
          </p>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Guide →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Video className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg mb-2">Video Tutorials</h3>
          <p className="text-gray-600 text-sm mb-4">
            Step-by-step video guides for common tasks and workflows
          </p>
          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
            Watch Videos →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg mb-2">FAQs</h3>
          <p className="text-gray-600 text-sm mb-4">
            Frequently asked questions and quick answers to common issues
          </p>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
            Browse FAQs →
          </button>
        </div>
      </div>

      {/* Common Topics */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl">Common Topics</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-6 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium mb-2">How do I enroll a new participant?</h3>
            <p className="text-gray-600 text-sm">
              Learn the step-by-step process for enrolling participants in your studies.
            </p>
          </div>
          <div className="p-6 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium mb-2">Managing participant payments and reimbursements</h3>
            <p className="text-gray-600 text-sm">
              Understand how to process payments, approve requests, and track reimbursements.
            </p>
          </div>
          <div className="p-6 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium mb-2">Scheduling and managing study visits</h3>
            <p className="text-gray-600 text-sm">
              Tips for efficiently scheduling visits and managing your calendar.
            </p>
          </div>
          <div className="p-6 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium mb-2">Bulk uploading data from Excel files</h3>
            <p className="text-gray-600 text-sm">
              Learn how to use the bulk upload feature for studies, participants, and visits.
            </p>
          </div>
          <div className="p-6 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium mb-2">Exporting data and generating reports</h3>
            <p className="text-gray-600 text-sm">
              How to export your data in various formats for analysis and reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl">Contact Support</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-2">Available Mon-Fri, 9am-5pm CST</p>
                <button className="text-sm text-blue-600 hover:text-blue-800">Start Chat →</button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Email Support</h3>
                <p className="text-sm text-gray-600 mb-2">Response within 24 hours</p>
                <a href="mailto:support@ppp.kumc.edu" className="text-sm text-purple-600 hover:text-purple-800">
                  support@ppp.kumc.edu
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-2">Mon-Fri, 9am-5pm CST</p>
                <a href="tel:+1-555-123-4567" className="text-sm text-green-600 hover:text-green-800">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Application Version:</span>
            <span className="font-medium">2.1.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-medium">January 5, 2026</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Database Version:</span>
            <span className="font-medium">1.8.3</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Environment:</span>
            <span className="font-medium">Production</span>
          </div>
        </div>
      </div>
    </div>
  );
}
